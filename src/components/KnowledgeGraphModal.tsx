import React, { useState } from 'react';
import { GraphNode, GraphEdge, LegalDomain } from '../types';
import { X, Network, ZoomIn, ZoomOut, RotateCcw, Info, Sparkles, Scale } from 'lucide-react';

interface KnowledgeGraphModalProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onClose: () => void;
  activeDomain?: LegalDomain;
  onSelectNodeDetail?: (node: GraphNode) => void;
}

export const KnowledgeGraphModal: React.FC<KnowledgeGraphModalProps> = ({
  nodes,
  edges,
  onClose,
  activeDomain,
  onSelectNodeDetail
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const selectedNode = nodes.find(n => n.id === (hoveredNodeId || selectedNodeId));

  // Node type styles
  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'query': return { bg: '#42121e', border: '#c5a880', text: '#faedd0' };
      case 'concept': return { bg: '#2b0c15', border: '#d4af37', text: '#f5f2eb' };
      case 'section': return { bg: '#1c1e28', border: '#8da4c4', text: '#e6edf5' };
      case 'act': return { bg: '#1a1d17', border: '#a3b18a', text: '#edf2ea' };
      case 'case': return { bg: '#22151d', border: '#c77d98', text: '#fae8f0' };
      case 'judgment': return { bg: '#1f1a14', border: '#d4a373', text: '#fcf6ed' };
      default: return { bg: '#12141a', border: '#c5a880', text: '#f5f2eb' };
    }
  };

  const filteredNodes = filterType === 'all' 
    ? nodes 
    : nodes.filter(n => n.type === filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md pointer-events-auto">
      {/* Container Frame */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0c0d10] border border-[#c5a880]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#12141c]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded border border-[#c5a880]/40 bg-[#2b0c15] flex items-center justify-center">
              <Network className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Cinzel'] text-sm tracking-wider text-[#f5f2eb] font-bold">
                  LEGAL KNOWLEDGE GRAPH
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded border border-[#c5a880]/20 text-[#c5a880] uppercase tracking-wider">
                  Connected Jurisprudence
                </span>
              </div>
              <p className="text-[11px] font-['Newsreader'] italic text-[#9e988f]">
                Tracing: Query → Legal Concept → Section → Act → Case → Judgment
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter buttons */}
            <div className="hidden sm:flex items-center space-x-1 p-1 rounded-lg border border-white/10 bg-[#151720]">
              {['all', 'concept', 'section', 'act', 'case'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded font-['Plus_Jakarta_Sans'] transition-colors ${
                    filterType === type
                      ? 'bg-[#c5a880] text-[#0c0d10] font-bold'
                      : 'text-[#8e887d] hover:text-[#f5f2eb]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded border border-white/10 text-[#8e887d] hover:text-[#f5f2eb] hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Graph Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-[#090a0d] flex items-center justify-center">
          {/* Subtle background coordinate grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #c5a880 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c5a880" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#801c30" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {edges.map((edge, idx) => {
              const src = nodes.find(n => n.id === edge.source);
              const tgt = nodes.find(n => n.id === edge.target);
              if (!src || !tgt || src.x === undefined || src.y === undefined || tgt.x === undefined || tgt.y === undefined) return null;

              const isHighlighted = (src.id === selectedNodeId || tgt.id === selectedNodeId) ||
                                    (src.id === hoveredNodeId || tgt.id === hoveredNodeId);

              return (
                <g key={idx}>
                  <line
                    x1={`${src.x}%`}
                    y1={`${src.y}%`}
                    x2={`${tgt.x}%`}
                    y2={`${tgt.y}%`}
                    stroke={isHighlighted ? '#d4af37' : 'rgba(197, 168, 128, 0.25)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                  />
                  {/* Midpoint relationship tag */}
                  <text
                    x={`${(src.x + tgt.x) / 2}%`}
                    y={`${(src.y + tgt.y) / 2}%`}
                    fill={isHighlighted ? '#faedd0' : 'rgba(160, 155, 145, 0.6)'}
                    fontSize="9"
                    fontFamily="Plus Jakarta Sans"
                    textAnchor="middle"
                    dy="-3"
                    className="select-none uppercase tracking-wider"
                  >
                    {edge.relationship}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Render Graph Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const style = getNodeColor(node.type);

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                data-cursor="inspect"
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 select-none ${
                  isSelected || isHovered ? 'scale-110 z-20' : 'scale-100 z-10'
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`
                }}
              >
                {/* Node Pill / Halo */}
                <div
                  className={`px-3 py-1.5 rounded-full border flex items-center space-x-2 shadow-lg backdrop-blur-md transition-all ${
                    isSelected
                      ? 'shadow-[0_0_20px_rgba(212,175,55,0.4)] ring-2 ring-[#d4af37]'
                      : 'hover:shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                  }`}
                  style={{
                    backgroundColor: style.bg,
                    borderColor: isSelected ? '#d4af37' : style.border
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: style.border }}
                  />
                  <span
                    className="text-xs font-['Plus_Jakarta_Sans'] font-medium whitespace-nowrap"
                    style={{ color: style.text }}
                  >
                    {node.label}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider opacity-60 font-mono">
                    {node.type}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Selected Node Details Card (Floating bottom left) */}
          {selectedNode && (
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md p-4 rounded-xl border border-[#c5a880]/30 bg-[#12141a]/95 backdrop-blur-lg shadow-2xl z-30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-['Plus_Jakarta_Sans'] uppercase tracking-widest text-[#d4af37] font-semibold">
                  {selectedNode.type} • {selectedNode.domain}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <h4 className="font-['Cinzel'] text-sm font-bold text-[#f5f2eb] mb-1">
                {selectedNode.label}
              </h4>
              <p className="font-['Newsreader'] italic text-xs text-[#c2bcae] leading-relaxed">
                {selectedNode.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-white/10 bg-[#111319] flex items-center justify-between text-[11px] text-[#787268]">
          <div className="flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Click any node to inspect semantic statutory links and case law hierarchy</span>
          </div>
          <div className="font-mono text-[#a39a8c]">
            {nodes.length} Nodes Connected • {edges.length} Active Vectors
          </div>
        </div>
      </div>
    </div>
  );
};
