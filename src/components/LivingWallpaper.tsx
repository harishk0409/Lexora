import React, { useEffect, useRef } from 'react';
import { ResearchStage } from '../types';

interface LivingWallpaperProps {
  stage?: ResearchStage;
  searchFocused?: boolean;
  searchQuery?: string;
  activeDomain?: string;
  onCanvasClick?: (x: number, y: number) => void;
}

interface NodePoint {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  clusterId: number;
  alpha: number;
  baseAlpha: number;
  hueShift: number; // 0: charcoal/gray, 1: muted gold, 2: deep crimson
  pulsePhase: number;
  pulseSpeed: number;
  activityLevel: number; // 0 to 1
}

interface ClusterDefinition {
  name: string;
  cxRel: number;
  cyRel: number;
  radiusRel: number;
  nodeCount: number;
  baseHue: 'gold' | 'crimson' | 'charcoal';
  driftSpeed: number;
}

interface DriftingGlyph {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  size: number;
  lifespan: number;
  age: number;
}

interface RippleShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  alpha: number;
}

interface SignalPacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const LivingWallpaperComponent: React.FC<LivingWallpaperProps> = ({
  stage = 'idle',
  searchFocused = false,
  searchQuery = '',
  activeDomain,
  onCanvasClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    isDown: false,
    activeTime: 0
  });

  const onCanvasClickRef = useRef(onCanvasClick);
  useEffect(() => {
    onCanvasClickRef.current = onCanvasClick;
  }, [onCanvasClick]);

  const stateRef = useRef({
    stage,
    searchFocused,
    searchQuery,
    activeDomain
  });

  useEffect(() => {
    stateRef.current = { stage, searchFocused, searchQuery, activeDomain };
  }, [stage, searchFocused, searchQuery, activeDomain]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Particle nodes
    let nodes: NodePoint[] = [];
    const ripples: RippleShockwave[] = [];
    const signals: SignalPacket[] = [];
    const glyphs: DriftingGlyph[] = [];

    // Lady Justice background artwork image
    const justiceImage = new Image();
    let isJusticeImageLoaded = false;
    justiceImage.src = '/lady_justice_bg.jpg';
    justiceImage.onload = () => {
      isJusticeImageLoaded = true;
    };

    const LEGAL_GLYPH_LIBRARY = [
      '§ 10', 'Art. 21', '§ 438', '§ 56', '¶ 14', '[1872]', 'v.', 'ex ante', 
      'stare decisis', 'mens rea', 'consensus ad idem', 'sine qua non', 
      'ex post facto', 'ratio decidendi', 'sub-s. (1)', 'Folio IV', 'SCR 310'
    ];

    // Defined Conceptual Clusters: CONTRACTS, CRIMINAL, CONSTITUTION, PROPERTY, TORTS, CASE LAW
    const clusterDefs: ClusterDefinition[] = [
      { name: 'CONSTITUTION', cxRel: 0.50, cyRel: 0.22, radiusRel: 0.25, nodeCount: 110, baseHue: 'gold', driftSpeed: 0.0006 },
      { name: 'CONTRACTS', cxRel: 0.20, cyRel: 0.38, radiusRel: 0.22, nodeCount: 95, baseHue: 'gold', driftSpeed: 0.0008 },
      { name: 'CRIMINAL', cxRel: 0.22, cyRel: 0.72, radiusRel: 0.24, nodeCount: 105, baseHue: 'crimson', driftSpeed: 0.0007 },
      { name: 'PROPERTY', cxRel: 0.80, cyRel: 0.35, radiusRel: 0.22, nodeCount: 85, baseHue: 'charcoal', driftSpeed: 0.0009 },
      { name: 'TORTS', cxRel: 0.78, cyRel: 0.72, radiusRel: 0.23, nodeCount: 95, baseHue: 'crimson', driftSpeed: 0.0008 },
      { name: 'CASE LAW', cxRel: 0.50, cyRel: 0.55, radiusRel: 0.28, nodeCount: 120, baseHue: 'gold', driftSpeed: 0.0005 }
    ];

    // Background ambient nodes
    const AMBIENT_COUNT = 100;

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      initWorld();
    };

    const initWorld = () => {
      nodes = [];
      let totalId = 0;

      // Initialize clusters with distinct densities and organic spread
      clusterDefs.forEach((cDef, clusterIndex) => {
        const clusterCenterX = cDef.cxRel * width;
        const clusterCenterY = cDef.cyRel * height;
        const clusterRadius = cDef.radiusRel * Math.min(width, height);

        for (let i = 0; i < cDef.nodeCount; i++) {
          // Gaussian-like concentration towards cluster center
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.pow(Math.random(), 1.6) * clusterRadius;
          const x = clusterCenterX + Math.cos(angle) * dist;
          const y = clusterCenterY + Math.sin(angle) * dist;

          const hueShift = cDef.baseHue === 'gold' ? 1 : cDef.baseHue === 'crimson' ? 2 : 0;
          const baseRadius = 0.9 + Math.random() * 1.5;
          const baseAlpha = 0.22 + Math.random() * 0.45;

          nodes.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: baseRadius,
            baseRadius,
            clusterId: clusterIndex,
            alpha: baseAlpha,
            baseAlpha,
            hueShift,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.015 + Math.random() * 0.025,
            activityLevel: 0
          });
          totalId++;
        }
      });

      // Ambient bridging nodes between clusters
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        nodes.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: 0.8 + Math.random() * 1.1,
          baseRadius: 0.8 + Math.random() * 1.1,
          clusterId: -1,
          alpha: 0.15 + Math.random() * 0.25,
          baseAlpha: 0.15 + Math.random() * 0.25,
          hueShift: Math.random() > 0.7 ? 1 : 0,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          activityLevel: 0
        });
        totalId++;
      }

      // Initialize faint drifting glyphs
      glyphs.length = 0;
      for (let g = 0; g < 14; g++) {
        spawnGlyph(true);
      }
    };

    const spawnGlyph = (initial = false) => {
      const text = LEGAL_GLYPH_LIBRARY[Math.floor(Math.random() * LEGAL_GLYPH_LIBRARY.length)];
      const x = initial ? Math.random() * width : (Math.random() > 0.5 ? Math.random() * width : (Math.random() > 0.5 ? -40 : width + 40));
      const y = initial ? Math.random() * height : Math.random() * height;
      const lifespan = 600 + Math.random() * 900;
      glyphs.push({
        text,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.15, // gently drift upward like ancient archival dust
        alpha: 0,
        maxAlpha: 0.08 + Math.random() * 0.12,
        size: 9 + Math.random() * 4,
        lifespan,
        age: initial ? Math.floor(Math.random() * (lifespan * 0.7)) : 0
      });
    };

    // Handle mouse movement for gravitational / ripple disturbance
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (mouseRef.current.x !== -9999) {
        mouseRef.current.vx = currentX - mouseRef.current.prevX;
        mouseRef.current.vy = currentY - mouseRef.current.prevY;
      }
      mouseRef.current.prevX = currentX;
      mouseRef.current.prevY = currentY;
      mouseRef.current.x = currentX;
      mouseRef.current.y = currentY;
      mouseRef.current.activeTime = performance.now();

      // If moving rapidly, trigger subtle trail ripple
      const speed = Math.hypot(mouseRef.current.vx, mouseRef.current.vy);
      if (speed > 16 && Math.random() > 0.6) {
        ripples.push({
          x: currentX,
          y: currentY,
          radius: 4,
          maxRadius: 65,
          strength: Math.min(speed * 0.12, 3),
          alpha: 0.28
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      mouseRef.current.vx = 0;
      mouseRef.current.vy = 0;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Spawn distinct propagation ripple
      ripples.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: 240,
        strength: 5.5,
        alpha: 0.65
      });

      // Spawn signal packets towards nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - clickX;
        const dy = nodes[i].y - clickY;
        const d = Math.hypot(dx, dy);
        if (d < 160 && Math.random() > 0.4) {
          nodes[i].activityLevel = 1.0;
          // Find neighbor to transmit signal
          for (let j = 0; j < nodes.length; j++) {
            if (i !== j) {
              const d2 = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
              if (d2 < 70) {
                signals.push({
                  fromNode: i,
                  toNode: j,
                  progress: 0,
                  speed: 0.04 + Math.random() * 0.03,
                  color: nodes[i].hueShift === 1 ? 'rgba(212, 175, 55, 0.8)' : 'rgba(200, 60, 80, 0.7)'
                });
                break;
              }
            }
          }
        }
      }

      if (onCanvasClickRef.current) {
        onCanvasClickRef.current(clickX, clickY);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    resize();

    // Occasional cluster activation interval (simulating information flowing through legal archive)
    let lastClusterPulseTime = performance.now();
    let clusterPulseTarget = 0;

    let time = 0;

    // Render loop
    const render = (currentTime: number) => {
      time += 0.016;

      // 1. Clear background: deep almost-black charcoal (#0a0b0d)
      ctx.fillStyle = '#0a0b0e';
      ctx.fillRect(0, 0, width, height);

      // 1A. LADY JUSTICE (JUSTITIA) MURAL INTEGRATION
      if (isJusticeImageLoaded && justiceImage.width > 0) {
        const imgRatio = justiceImage.width / justiceImage.height;
        const canvasRatio = width / height;
        let renderW = width;
        let renderH = height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          renderW = width;
          renderH = width / imgRatio;
          offsetY = (height - renderH) * 0.45;
        } else {
          renderH = height;
          renderW = height * imgRatio;
          offsetX = (width - renderW) * 0.5;
        }

        ctx.save();
        // Atmospheric deep integration opacity
        const baseMuralAlpha = stateRef.current.searchFocused ? 0.38 : 0.30;
        const breathingAlpha = baseMuralAlpha + Math.sin(time * 0.6) * 0.03;
        ctx.globalAlpha = Math.min(0.45, Math.max(0.22, breathingAlpha));
        ctx.drawImage(justiceImage, offsetX, offsetY, renderW, renderH);
        ctx.restore();
      }

      // Atmospheric vignette & deep crimson/burgundy archival aura protecting text contrast
      const radialGlow = ctx.createRadialGradient(
        width * 0.5, height * 0.48, 120,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.72
      );
      radialGlow.addColorStop(0, 'rgba(42, 14, 24, 0.28)'); // subtle deep burgundy archival core
      radialGlow.addColorStop(0.45, 'rgba(14, 16, 22, 0.42)');
      radialGlow.addColorStop(0.8, 'rgba(10, 11, 14, 0.75)');
      radialGlow.addColorStop(1, 'rgba(6, 7, 9, 0.94)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const isMouseActive = mouse.x !== -9999;
      const currentStage = stateRef.current.stage;
      const isFocused = stateRef.current.searchFocused;
      const queryLength = (stateRef.current.searchQuery || '').length;

      // =========================================================================
      // 1B. DISTINCTLY LEGAL ARCHIVE MOTIFS: ARCHITECTURE, SCALES OF JUSTICE & MAXIMS
      // =========================================================================
      
      // 1. Classical Temple of Justice Architectural Lines (Faint Neoclassical Columns & Pediment)
      const archCenterX = width * 0.5;
      const pedimentApexY = height * 0.05;
      const pedimentBaseY = height * 0.15;
      const pedimentWidth = Math.min(width * 0.85, 980);
      const pedimentLeft = archCenterX - pedimentWidth * 0.5;
      const pedimentRight = archCenterX + pedimentWidth * 0.5;

      ctx.save();
      // Pediment Triangle
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.07)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(archCenterX, pedimentApexY);
      ctx.lineTo(pedimentLeft, pedimentBaseY);
      ctx.lineTo(pedimentRight, pedimentBaseY);
      ctx.closePath();
      ctx.stroke();

      // Inner Pediment Tympanum line
      ctx.beginPath();
      ctx.moveTo(archCenterX, pedimentApexY + 12);
      ctx.lineTo(pedimentLeft + 25, pedimentBaseY - 6);
      ctx.lineTo(pedimentRight - 25, pedimentBaseY - 6);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.04)';
      ctx.stroke();

      // Entablature & Frieze
      ctx.fillStyle = 'rgba(197, 168, 128, 0.05)';
      ctx.font = '600 11px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '0.35em';
      ctx.fillText('J U S T I T I A   •   L E X   •   A E Q U I T A S', archCenterX, pedimentBaseY - 14);

      // Classical Fluted Columns
      const columnCount = width > 768 ? 6 : 4;
      const columnSpacing = pedimentWidth / (columnCount + 1);
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.04)';
      ctx.lineWidth = 1;
      
      for (let c = 1; c <= columnCount; c++) {
        const colX = pedimentLeft + c * columnSpacing;
        const colTopY = pedimentBaseY + 6;
        const colBottomY = height * 0.82;

        // Capital
        ctx.strokeRect(colX - 14, colTopY, 28, 6);
        // Column shaft flutes
        ctx.beginPath();
        ctx.moveTo(colX - 8, colTopY + 6);
        ctx.lineTo(colX - 8, colBottomY);
        ctx.moveTo(colX, colTopY + 6);
        ctx.lineTo(colX, colBottomY);
        ctx.moveTo(colX + 8, colTopY + 6);
        ctx.lineTo(colX + 8, colBottomY);
        ctx.stroke();
        // Column base
        ctx.strokeRect(colX - 16, colBottomY, 32, 6);
      }
      ctx.restore();

      // 2. The Celestial Scales of Justice (Libra)
      // Positioned gracefully in the upper-mid field
      const scalesX = width * 0.5;
      const scalesY = height * 0.28;
      const beamLength = Math.min(width * 0.5, 340);
      
      // Dynamic organic sway of the scales (influenced by time & mouse cursor displacement)
      const mouseTilt = isMouseActive ? ((mouse.x - scalesX) / width) * 0.08 : 0;
      const swayAngle = Math.sin(time * 0.75) * 0.035 + mouseTilt;

      ctx.save();
      ctx.translate(scalesX, scalesY);

      // Central Pillar of Justice
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Finial crest
      ctx.arc(0, -22, 5, 0, Math.PI * 2);
      ctx.moveTo(0, -17);
      ctx.lineTo(0, 75);
      // Pillar pedestal
      ctx.moveTo(-16, 75);
      ctx.lineTo(16, 75);
      ctx.moveTo(-22, 80);
      ctx.lineTo(22, 80);
      ctx.stroke();

      // Horizontal Balance Beam (rotating with swayAngle)
      ctx.rotate(swayAngle);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-beamLength * 0.5, 0);
      ctx.lineTo(beamLength * 0.5, 0);
      // Fulcrum pivot
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.stroke();

      // Left Scale Pan (Suspended by 3 fine chains)
      const leftPanX = -beamLength * 0.5;
      const chainLength = 55;
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(197, 168, 128, 0.18)';
      ctx.beginPath();
      ctx.moveTo(leftPanX, 0);
      ctx.lineTo(leftPanX - 16, chainLength);
      ctx.moveTo(leftPanX, 0);
      ctx.lineTo(leftPanX, chainLength + 2);
      ctx.moveTo(leftPanX, 0);
      ctx.lineTo(leftPanX + 16, chainLength);
      // Pan bowl
      ctx.arc(leftPanX, chainLength + 4, 18, 0, Math.PI);
      ctx.stroke();

      // Glowing evidence particles on left pan
      ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.beginPath();
      ctx.arc(leftPanX - 6, chainLength + 6, 2, 0, Math.PI * 2);
      ctx.arc(leftPanX + 5, chainLength + 5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Right Scale Pan
      const rightPanX = beamLength * 0.5;
      ctx.beginPath();
      ctx.moveTo(rightPanX, 0);
      ctx.lineTo(rightPanX - 16, chainLength);
      ctx.moveTo(rightPanX, 0);
      ctx.lineTo(rightPanX, chainLength + 2);
      ctx.moveTo(rightPanX, 0);
      ctx.lineTo(rightPanX + 16, chainLength);
      // Pan bowl
      ctx.arc(rightPanX, chainLength + 4, 18, 0, Math.PI);
      ctx.stroke();

      // Glowing precedent particles on right pan
      ctx.fillStyle = 'rgba(197, 168, 128, 0.5)';
      ctx.beginPath();
      ctx.arc(rightPanX - 4, chainLength + 5, 2.2, 0, Math.PI * 2);
      ctx.arc(rightPanX + 4, chainLength + 7, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 2B. Upright Sword of Justice (Gladium Justitiae)
      ctx.save();
      const swordX = scalesX + beamLength * 0.58;
      const swordY = scalesY + 25;
      ctx.translate(swordX, swordY);
      
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Round pommel
      ctx.arc(0, 75, 4, 0, Math.PI * 2);
      // Grip
      ctx.moveTo(0, 71);
      ctx.lineTo(0, 48);
      // Crossguard
      ctx.moveTo(-14, 48);
      ctx.lineTo(14, 48);
      // Double-edged blade
      ctx.moveTo(-4, 48);
      ctx.lineTo(-3, -65);
      ctx.lineTo(0, -78); // tip of sword
      ctx.lineTo(3, -65);
      ctx.lineTo(4, 48);
      // Fuller central ridge
      ctx.moveTo(0, 48);
      ctx.lineTo(0, -68);
      ctx.stroke();

      // Blade tip gleam responding to time
      const swordGlint = (Math.sin(time * 1.5) + 1) * 0.5;
      ctx.fillStyle = `rgba(250, 237, 208, ${0.2 + swordGlint * 0.4})`;
      ctx.beginPath();
      ctx.arc(0, -78, 2 + swordGlint * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Faint Law Codex Marginalia Lines & Latin Maxims Watermarked into the Canvas
      ctx.save();
      ctx.font = 'italic 11px "Newsreader", Georgia, serif';
      ctx.fillStyle = 'rgba(197, 168, 128, 0.07)';

      if (width > 800) {
        // Left Folio Border & Maxims
        ctx.strokeStyle = 'rgba(197, 168, 128, 0.05)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(40, 60);
        ctx.lineTo(40, height - 60);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillText('LIBER I • DE IUSTITIA ET IURE', 52, 120);
        ctx.fillText('ACTUS NON FACIT REUM NISI MENS SIT REA', 52, 190);
        ctx.fillText('UBI IUS IBI REMEDIUM', 52, 260);
        ctx.fillText('DURA LEX SED LEX', 52, 330);
        ctx.fillText('NEMO IUDEX IN CAUSA SUA', 52, 400);

        // Right Folio Border & Maxims
        ctx.beginPath();
        ctx.moveTo(width - 40, 60);
        ctx.lineTo(width - 40, height - 60);
        ctx.stroke();

        ctx.textAlign = 'right';
        ctx.fillText('SALUS POPULI SUPREMA LEX ESTO', width - 52, 120);
        ctx.fillText('AUDI ALTERAM PARTEM', width - 52, 190);
        ctx.fillText('IN DUBIO PRO REO', width - 52, 260);
        ctx.fillText('IGNORANTIA IURIS NON EXCUSAT', width - 52, 330);
        ctx.fillText('STARE DECISIS ET NON QUIETA MOVERE', width - 52, 400);
      }
      ctx.restore();

      // Periodically trigger cluster pulse
      if (currentTime - lastClusterPulseTime > 4200) {
        lastClusterPulseTime = currentTime;
        clusterPulseTarget = (clusterPulseTarget + 1) % clusterDefs.length;
        // activate nodes in that cluster
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].clusterId === clusterPulseTarget && Math.random() > 0.4) {
            nodes[i].activityLevel = 0.8;
          }
        }
      }

      // If stage is thinking/researching, dynamically activate nodes along paths
      if (currentStage !== 'idle' && currentStage !== 'completed') {
        const stageIntensity = 
          currentStage === 'exploring' ? 0.35 :
          currentStage === 'connecting' ? 0.65 :
          currentStage === 'assembling' ? 0.85 : 1.0;

        if (Math.random() < 0.25 * stageIntensity) {
          const randNode = Math.floor(Math.random() * nodes.length);
          nodes[randNode].activityLevel = 1.0;

          // Spawn signal packet
          const targetNode = (randNode + Math.floor(Math.random() * 20) + 1) % nodes.length;
          signals.push({
            fromNode: randNode,
            toNode: targetNode,
            progress: 0,
            speed: 0.05 + Math.random() * 0.04,
            color: 'rgba(212, 185, 120, 0.85)'
          });
        }
      }

      // 2. Update and render ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += (rip.maxRadius - rip.radius) * 0.07 + 0.8;
        rip.alpha *= 0.94;

        if (rip.alpha > 0.01 && rip.radius < rip.maxRadius) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(197, 168, 128, ${rip.alpha * 0.45})`;
          ctx.lineWidth = Math.max(0.7, 2 * rip.alpha);
          ctx.stroke();

          // Outer secondary echo wave
          if (rip.radius > 20) {
            ctx.beginPath();
            ctx.arc(rip.x, rip.y, rip.radius * 0.82, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(66, 18, 32, ${rip.alpha * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        } else {
          ripples.splice(r, 1);
        }
      }

      // 3. Update nodes physics
      const centerPortalX = width * 0.5;
      const centerPortalY = height * 0.46;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Natural sinusoidal organic drift
        node.pulsePhase += node.pulseSpeed;
        const breath = Math.sin(node.pulsePhase);
        
        // Base restoration force to origin
        const dxOrigin = node.originX - node.x;
        const dyOrigin = node.originY - node.y;
        node.vx += dxOrigin * 0.0018;
        node.vy += dyOrigin * 0.0018;

        // Subtle natural wander
        node.vx += Math.cos(time * 0.4 + i) * 0.012;
        node.vy += Math.sin(time * 0.35 + i) * 0.012;

        // CURSOR GRAVITATIONAL / DISTURBANCE INTERACTION
        if (isMouseActive) {
          const dxMouse = node.x - mouse.x;
          const dyMouse = node.y - mouse.y;
          const distMouse = Math.hypot(dxMouse, dyMouse);
          const maxInfluence = 170;

          if (distMouse < maxInfluence && distMouse > 1) {
            const factor = (1 - distMouse / maxInfluence);
            // Repulsion + subtle orbital tangent force
            const force = factor * factor * 1.8;
            const normX = dxMouse / distMouse;
            const normY = dyMouse / distMouse;

            // Push away
            node.vx += normX * force;
            node.vy += normY * force;

            // Tangent spin
            const tangentX = -normY;
            const tangentY = normX;
            node.vx += tangentX * factor * 0.8;
            node.vy += tangentY * factor * 0.8;

            // Rouse activity & size
            node.activityLevel = Math.max(node.activityLevel, factor * 0.8);
          }
        }

        // Ripples pushing particles
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const dxRip = node.x - rip.x;
          const dyRip = node.y - rip.y;
          const distRip = Math.hypot(dxRip, dyRip);
          const waveDist = Math.abs(distRip - rip.radius);
          if (waveDist < 25) {
            const pushFactor = (1 - waveDist / 25) * rip.strength * rip.alpha * 0.35;
            if (distRip > 0) {
              node.vx += (dxRip / distRip) * pushFactor;
              node.vy += (dyRip / distRip) * pushFactor;
              node.activityLevel = Math.max(node.activityLevel, 0.6);
            }
          }
        }

        // SEARCH PORTAL REACTION: calm atmospheric focus without glitching or typing jitter
        if (isFocused) {
          const dxCenter = centerPortalX - node.x;
          const dyCenter = centerPortalY - node.y;
          const distCenter = Math.hypot(dxCenter, dyCenter);
          if (distCenter > 130) {
            const pull = 0.00025;
            node.vx += (dxCenter / distCenter) * pull * 10;
            node.vy += (dyCenter / distCenter) * pull * 10;
          }
        }

        // Apply velocity with air damping
        node.vx *= 0.94;
        node.vy *= 0.94;
        node.x += node.vx;
        node.y += node.vy;

        // Activity level decay
        node.activityLevel = Math.max(0, node.activityLevel - 0.015);

        // Effective radius and alpha
        node.radius = node.baseRadius + breath * 0.3 + node.activityLevel * 1.5;
        node.alpha = Math.min(1, node.baseAlpha + breath * 0.08 + node.activityLevel * 0.5);
      }

      // 4. Render interconnected network lines
      // Distinct connection rules: connect predominantly within same cluster or to close neighbors
      ctx.lineWidth = 0.6;
      const maxConnectDist = 68;

      for (let i = 0; i < nodes.length; i++) {
        const nA = nodes[i];
        // Sample a limited window of neighbors for performance
        const step = Math.max(1, Math.floor(nodes.length / 140));
        for (let j = i + 1; j < nodes.length; j += step) {
          const nB = nodes[j];

          // Check if distance is candidate
          const dx = nA.x - nB.x;
          const dy = nA.y - nB.y;
          const d2 = dx * dx + dy * dy;

          if (d2 < maxConnectDist * maxConnectDist) {
            const dist = Math.sqrt(d2);
            let linkAlpha = (1 - dist / maxConnectDist) * 0.22;

            // Extra brightness if nodes are active or near cursor
            const maxActivity = Math.max(nA.activityLevel, nB.activityLevel);
            if (maxActivity > 0) {
              linkAlpha += maxActivity * 0.35;
            }

            // Connection line color logic
            let strokeStyle = `rgba(160, 155, 150, ${linkAlpha * 0.8})`; // soft charcoal-white
            if (nA.hueShift === 1 || nB.hueShift === 1) {
              strokeStyle = `rgba(202, 168, 115, ${linkAlpha})`; // antique gold
            } else if (nA.hueShift === 2 || nB.hueShift === 2) {
              strokeStyle = `rgba(110, 30, 48, ${linkAlpha * 1.1})`; // deep crimson / burgundy
            }

            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.moveTo(nA.x, nA.y);
            ctx.lineTo(nB.x, nB.y);
            ctx.stroke();
          }
        }
      }

      // 5. Render moving signal packets
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.progress += sig.speed;
        if (sig.progress >= 1) {
          signals.splice(s, 1);
          continue;
        }

        const from = nodes[sig.fromNode];
        const to = nodes[sig.toNode];
        if (from && to) {
          const curX = from.x + (to.x - from.x) * sig.progress;
          const curY = from.y + (to.y - from.y) * sig.progress;

          ctx.beginPath();
          ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = sig.color;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 6. Render nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.6, n.radius), 0, Math.PI * 2);

        if (n.activityLevel > 0.3 || n.hueShift === 1) {
          // Antique gold glow
          ctx.fillStyle = `rgba(218, 185, 130, ${n.alpha})`;
          if (n.activityLevel > 0.4) {
            ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
            ctx.shadowBlur = 5;
          }
        } else if (n.hueShift === 2) {
          // Deep crimson
          ctx.fillStyle = `rgba(145, 35, 55, ${n.alpha})`;
        } else {
          // Soft warm white / soft gray
          ctx.fillStyle = `rgba(220, 215, 205, ${n.alpha})`;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 7. Render drifting faint legal glyphs
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let g = glyphs.length - 1; g >= 0; g--) {
        const glyph = glyphs[g];
        glyph.age++;
        glyph.x += glyph.vx;
        glyph.y += glyph.vy;

        // Fade in and out
        const progress = glyph.age / glyph.lifespan;
        if (progress < 0.2) {
          glyph.alpha = (progress / 0.2) * glyph.maxAlpha;
        } else if (progress > 0.8) {
          glyph.alpha = (1 - (progress - 0.8) / 0.2) * glyph.maxAlpha;
        } else {
          glyph.alpha = glyph.maxAlpha;
        }

        if (glyph.age >= glyph.lifespan || glyph.y < -30) {
          glyphs.splice(g, 1);
          spawnGlyph(false);
          continue;
        }

        ctx.font = `italic ${glyph.size}px 'Newsreader', Georgia, serif`;
        ctx.fillStyle = `rgba(197, 168, 128, ${glyph.alpha})`;
        ctx.fillText(glyph.text, glyph.x, glyph.y);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, []); // Mount canvas simulation once; never tear down on keystrokes

  return (
    <canvas
      ref={canvasRef}
      id="living-archive-canvas"
      className="fixed inset-0 pointer-events-auto z-0 cursor-default"
      style={{ touchAction: 'none' }}
    />
  );
};

export const LivingWallpaper = React.memo(LivingWallpaperComponent);
