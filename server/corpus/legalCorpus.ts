/**
 * Authoritative Legal Knowledge Corpus extracted from:
 * 1. The Constitution of India (as on 1st May, 2026, 106th Amendment inclusive)
 * 2. The Indian Penal Code, 1860 (Act No. 45 of 1860)
 * 3. The Information Technology Act & Certifying Authorities / Cyber Appellate Tribunal Rules, 2000
 */

export interface LegalChunk {
  id: string;
  sourceDoc: 'Constitution of India' | 'Indian Penal Code' | 'Information Technology Rules';
  domain: 'Constitution' | 'Criminal' | 'Cyber & Tech' | 'Property' | 'Contracts' | 'Judiciary';
  partOrChapter: string;
  sectionOrArticle: string;
  title: string;
  content: string;
  keyTerms: string[];
  crossReferences: string[];
  importanceWeight: number; // base prior for RAG retrieval
}

export const LEGAL_CORPUS: LegalChunk[] = [
  // ==========================================
  // 1. THE CONSTITUTION OF INDIA
  // ==========================================
  {
    id: 'CONST_PREAMBLE',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Preamble',
    sectionOrArticle: 'Preamble',
    title: 'Preamble to the Constitution of India',
    content: 'WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.',
    keyTerms: ['Preamble', 'Sovereign', 'Socialist', 'Secular', 'Democratic Republic', 'Justice', 'Liberty', 'Equality', 'Fraternity', 'Basic Structure'],
    crossReferences: ['CONST_ART_14', 'CONST_ART_19', 'CONST_ART_21', 'CONST_ART_368'],
    importanceWeight: 1.0
  },
  {
    id: 'CONST_ART_12',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Fundamental Rights',
    sectionOrArticle: 'Article 12',
    title: 'Definition of "the State"',
    content: 'In this Part, unless the context otherwise requires, "the State" includes the Government and Parliament of India and the Government and the Legislature of each of the States and all local or other authorities within the territory of India or under the control of the Government of India.',
    keyTerms: ['State Definition', 'Local Authorities', 'Instrumentality of State', 'Other Authorities', 'Fundamental Rights applicability'],
    crossReferences: ['CONST_ART_13', 'CONST_ART_32', 'CONST_ART_226'],
    importanceWeight: 0.85
  },
  {
    id: 'CONST_ART_13',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Fundamental Rights',
    sectionOrArticle: 'Article 13',
    title: 'Laws Inconsistent with or in Derogation of the Fundamental Rights',
    content: '(1) All laws in force in the territory of India immediately before the commencement of this Constitution, in so far as they are inconsistent with the provisions of this Part, shall, to the extent of such inconsistency, be void. (2) The State shall not make any law which takes away or abridges the rights conferred by this Part and any law made in contravention of this clause shall, to the extent of the contravention, be void. (3) "law" includes any Ordinance, order, bye-law, rule, regulation, notification, custom or usage having the force of law. (4) Nothing in this article shall apply to any amendment made under article 368.',
    keyTerms: ['Judicial Review', 'Doctrine of Severability', 'Doctrine of Eclipse', 'Ultra Vires', 'Void Laws'],
    crossReferences: ['CONST_ART_32', 'CONST_ART_226', 'CONST_ART_368'],
    importanceWeight: 0.95
  },
  {
    id: 'CONST_ART_14',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Right to Equality',
    sectionOrArticle: 'Article 14',
    title: 'Equality before Law',
    content: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
    keyTerms: ['Equality before Law', 'Equal Protection of Laws', 'Rule of Law', 'Reasonable Classification', 'Arbitrariness Doctrine'],
    crossReferences: ['CONST_ART_15', 'CONST_ART_16', 'CONST_ART_21', 'CONST_PREAMBLE'],
    importanceWeight: 0.98
  },
  {
    id: 'CONST_ART_19',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Right to Freedom',
    sectionOrArticle: 'Article 19',
    title: 'Protection of Certain Rights regarding Freedom of Speech, etc.',
    content: '(1) All citizens shall have the right— (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions or co-operative societies; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; (g) to practise any profession, or to carry on any occupation, trade or business. (2) Reasonable restrictions may be imposed in interests of sovereignty and integrity of India, security of State, friendly relations with foreign States, public order, decency, morality, contempt of court, defamation, or incitement to an offence.',
    keyTerms: ['Freedom of Speech and Expression', 'Peaceful Assembly', 'Right to Trade', 'Reasonable Restrictions', 'Public Order', 'Defamation'],
    crossReferences: ['CONST_ART_21', 'IPC_SEC_124A', 'IPC_SEC_499', 'IPC_SEC_153A'],
    importanceWeight: 0.98
  },
  {
    id: 'CONST_ART_21',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Right to Freedom',
    sectionOrArticle: 'Article 21',
    title: 'Protection of Life and Personal Liberty',
    content: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    keyTerms: ['Right to Life', 'Personal Liberty', 'Procedure Established by Law', 'Due Process', 'Maneka Gandhi Doctrine', 'Right to Privacy', 'Right to Dignity'],
    crossReferences: ['CONST_ART_14', 'CONST_ART_19', 'CONST_ART_22', 'IPC_SEC_300', 'IPC_SEC_302'],
    importanceWeight: 1.0
  },
  {
    id: 'CONST_ART_21A',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Right to Freedom',
    sectionOrArticle: 'Article 21A',
    title: 'Right to Education',
    content: 'The State shall provide free and compulsory education to all children of the age of six to fourteen years in such manner as the State may, by law, determine.',
    keyTerms: ['Right to Education', 'Compulsory Education', 'Child Rights', '86th Amendment'],
    crossReferences: ['CONST_ART_45', 'CONST_ART_51A'],
    importanceWeight: 0.85
  },
  {
    id: 'CONST_ART_22',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Right to Freedom',
    sectionOrArticle: 'Article 22',
    title: 'Protection against Arrest and Detention in Certain Cases',
    content: '(1) No person who is arrested shall be detained in custody without being informed of the grounds for such arrest nor denied the right to consult and be defended by a legal practitioner of his choice. (2) Every person arrested and detained shall be produced before the nearest magistrate within twenty-four hours of such arrest, excluding journey time. (3)-(7) Preventive detention limitations, Advisory Board review for detention exceeding maximum prescribed period, and obligation to communicate grounds of detention.',
    keyTerms: ['Arrest Safeguards', '24-hour Magistrate Rule', 'Right to Counsel', 'Preventive Detention', 'Advisory Board'],
    crossReferences: ['CONST_ART_21', 'IPC_SEC_220', 'IPC_SEC_340'],
    importanceWeight: 0.92
  },
  {
    id: 'CONST_ART_32',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part III - Right to Constitutional Remedies',
    sectionOrArticle: 'Article 32',
    title: 'Remedies for Enforcement of Rights Conferred by Part III',
    content: '(1) The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed. (2) The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, whichever may be appropriate, for the enforcement of any of the rights conferred by this Part.',
    keyTerms: ['Constitutional Remedies', 'Writs', 'Habeas Corpus', 'Mandamus', 'Certiorari', 'Prohibition', 'Quo Warranto', 'Supreme Court Jurisdiction'],
    crossReferences: ['CONST_ART_226', 'CONST_ART_136', 'CONST_ART_142'],
    importanceWeight: 0.98
  },
  {
    id: 'CONST_ART_39A',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part IV - Directive Principles of State Policy',
    sectionOrArticle: 'Article 39A',
    title: 'Equal Justice and Free Legal Aid',
    content: 'The State shall secure that the operation of the legal system promotes justice, on a basis of equal opportunity, and shall, in particular, provide free legal aid, by suitable legislation or schemes or in any other way, to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities.',
    keyTerms: ['Equal Justice', 'Free Legal Aid', 'Legal Services Authority', 'Access to Justice', 'Directive Principles'],
    crossReferences: ['CONST_ART_14', 'CONST_ART_21'],
    importanceWeight: 0.88
  },
  {
    id: 'CONST_ART_50',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part IV - Directive Principles of State Policy',
    sectionOrArticle: 'Article 50',
    title: 'Separation of Judiciary from Executive',
    content: 'The State shall take steps to separate the judiciary from the executive in the public services of the State.',
    keyTerms: ['Separation of Powers', 'Judicial Independence', 'Executive Boundary'],
    crossReferences: ['CONST_ART_124', 'CONST_ART_217', 'CONST_ART_235'],
    importanceWeight: 0.82
  },
  {
    id: 'CONST_ART_124',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part V - The Union Judiciary',
    sectionOrArticle: 'Article 124',
    title: 'Establishment and Constitution of the Supreme Court',
    content: '(1) There shall be a Supreme Court of India consisting of a Chief Justice of India and other Judges. (2) Every Judge of the Supreme Court shall be appointed by the President by warrant under his hand and seal, holding office until age sixty-five. (4) A Judge of the Supreme Court shall not be removed from office except by an order of the President passed after an address by each House of Parliament supported by a majority of the total membership and a majority of not less than two-thirds of members present and voting, on the ground of proved misbehaviour or incapacity.',
    keyTerms: ['Supreme Court of India', 'Chief Justice of India', 'Appointment of Judges', 'Collegium', 'Impeachment Process', 'Judicial Independence'],
    crossReferences: ['CONST_ART_129', 'CONST_ART_141', 'CONST_ART_217'],
    importanceWeight: 0.94
  },
  {
    id: 'CONST_ART_136',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part V - The Union Judiciary',
    sectionOrArticle: 'Article 136',
    title: 'Special Leave to Appeal by the Supreme Court',
    content: '(1) Notwithstanding anything in this Chapter, the Supreme Court may, in its discretion, grant special leave to appeal from any judgment, decree, determination, sentence or order in any cause or matter passed or made by any court or tribunal in the territory of India. (2) Nothing in clause (1) shall apply to any judgment, determination, sentence or order passed or made by any court or tribunal constituted by or under any law relating to the Armed Forces.',
    keyTerms: ['Special Leave Petition', 'SLP', 'Discretionary Appellate Jurisdiction', 'Tribunal Appeals'],
    crossReferences: ['CONST_ART_132', 'CONST_ART_133', 'CONST_ART_134', 'CONST_ART_141'],
    importanceWeight: 0.92
  },
  {
    id: 'CONST_ART_141',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part V - The Union Judiciary',
    sectionOrArticle: 'Article 141',
    title: 'Law Declared by Supreme Court to be Binding on all Courts',
    content: 'The law declared by the Supreme Court shall be binding on all courts within the territory of India.',
    keyTerms: ['Stare Decisis', 'Law Declared', 'Binding Precedent', 'Ratio Decidendi', 'Obiter Dicta'],
    crossReferences: ['CONST_ART_142', 'CONST_ART_144'],
    importanceWeight: 0.96
  },
  {
    id: 'CONST_ART_142',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part V - The Union Judiciary',
    sectionOrArticle: 'Article 142',
    title: 'Enforcement of Decrees and Orders of Supreme Court (Complete Justice)',
    content: '(1) The Supreme Court in the exercise of its jurisdiction may pass such decree or make such order as is necessary for doing complete justice in any cause or matter pending before it, and any decree so passed or order so made shall be enforceable throughout the territory of India. (2) Power to secure attendance of persons, discovery or production of documents, or investigate or punish for contempt of itself.',
    keyTerms: ['Complete Justice', 'Inherent Powers', 'Enforcement of Decrees', 'Article 142 Jurisdiction', 'Curative Powers'],
    crossReferences: ['CONST_ART_129', 'CONST_ART_141', 'CONST_ART_144'],
    importanceWeight: 0.95
  },
  {
    id: 'CONST_ART_226',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part VI - The High Courts in the States',
    sectionOrArticle: 'Article 226',
    title: 'Power of High Courts to Issue Certain Writs',
    content: '(1) Notwithstanding anything in article 32, every High Court shall have power, throughout the territories in relation to which it exercises jurisdiction, to issue to any person or authority, including in appropriate cases, any Government, directions, orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari, or any of them, for the enforcement of any of the rights conferred by Part III and for any other purpose. (2) Power may be exercised where cause of action arises wholly or in part within jurisdiction.',
    keyTerms: ['High Court Writ Jurisdiction', 'For Any Other Purpose', 'Habeas Corpus', 'Mandamus', 'Certiorari', 'Territorial Jurisdiction'],
    crossReferences: ['CONST_ART_32', 'CONST_ART_227'],
    importanceWeight: 0.98
  },
  {
    id: 'CONST_ART_246',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part XI - Legislative Relations',
    sectionOrArticle: 'Article 246 & Seventh Schedule',
    title: 'Subject-matter of Laws made by Parliament and State Legislatures',
    content: '(1) Parliament has exclusive power to make laws with respect to matters in List I (Union List). (2) Parliament and State Legislatures have power to make laws with respect to matters in List III (Concurrent List). (3) State Legislatures have exclusive power for matters in List II (State List). Seventh Schedule distributes powers across Union (Defence, Foreign Affairs, Banking, Taxes on Income), State (Public order, Police, Prisons, Public health, Land), and Concurrent (Criminal law, Criminal procedure, Contracts, Civil procedure).',
    keyTerms: ['Seventh Schedule', 'Union List', 'State List', 'Concurrent List', 'Pith and Substance', 'Federal Legislative Powers'],
    crossReferences: ['CONST_ART_246A', 'CONST_ART_248', 'CONST_ART_254'],
    importanceWeight: 0.90
  },
  {
    id: 'CONST_ART_254',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part XI - Legislative Relations',
    sectionOrArticle: 'Article 254',
    title: 'Inconsistency between Laws made by Parliament and State Legislatures (Repugnancy)',
    content: '(1) If any provision of a law made by the Legislature of a State is repugnant to any provision of a law made by Parliament which Parliament is competent to enact, or to any provision of an existing law on Concurrent List, the law made by Parliament shall prevail and State law to extent of repugnancy is void. (2) Exception: Where State law receives assent of the President after being reserved for consideration, State law prevails in that State.',
    keyTerms: ['Doctrine of Repugnancy', 'Concurrent List conflict', 'Presidential Assent', 'Supremacy of Central Law'],
    crossReferences: ['CONST_ART_246', 'CONST_ART_248'],
    importanceWeight: 0.88
  },
  {
    id: 'CONST_ART_300A',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part XII - Right to Property',
    sectionOrArticle: 'Article 300A',
    title: 'Persons not to be Deprived of Property Save by Authority of Law',
    content: 'No person shall be deprived of his property save by authority of law.',
    keyTerms: ['Right to Property', 'Eminent Domain', 'Authority of Law', '44th Amendment', 'Deprivation of Property'],
    crossReferences: ['CONST_ART_14', 'CONST_ART_19', 'CONST_ART_31A'],
    importanceWeight: 0.90
  },
  {
    id: 'CONST_ART_311',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part XIV - Services Under Union and States',
    sectionOrArticle: 'Article 311',
    title: 'Dismissal, Removal or Reduction in Rank of Civil Servants',
    content: '(1) No person in civil service of Union or State shall be dismissed or removed by an authority subordinate to that by which he was appointed. (2) No such person shall be dismissed, removed or reduced in rank except after an inquiry in which he has been informed of charges and given reasonable opportunity of being heard. Proviso exceptions: conviction on criminal charge, or where holding inquiry is not reasonably practicable, or in interest of security of State.',
    keyTerms: ['Civil Servants Protection', 'Natural Justice', 'Reasonable Opportunity', 'Inquiry Procedure', 'Doctrine of Pleasure'],
    crossReferences: ['CONST_ART_309', 'CONST_ART_310'],
    importanceWeight: 0.85
  },
  {
    id: 'CONST_ART_368',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part XX - Amendment of the Constitution',
    sectionOrArticle: 'Article 368',
    title: 'Power of Parliament to Amend the Constitution and Procedure',
    content: '(1) Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of this Constitution in accordance with procedure laid down. (2) Bill passed by two-thirds majority of members present and voting and absolute majority of total membership in each House. Proviso: federal provisions require ratification by not less than one-half of States. Note: Kesavananda Bharati basic structure doctrine restricts power from altering basic features.',
    keyTerms: ['Constituent Power', 'Constitutional Amendment', 'Two-thirds Majority', 'State Ratification', 'Basic Structure Doctrine', 'Kesavananda Bharati'],
    crossReferences: ['CONST_ART_13', 'CONST_PREAMBLE'],
    importanceWeight: 0.95
  },
  {
    id: 'CONST_ART_370_APPENDIX',
    sourceDoc: 'Constitution of India',
    domain: 'Constitution',
    partOrChapter: 'Part XXI & Appendix II/III',
    sectionOrArticle: 'Article 370 & C.O. 272/273',
    title: 'Declaration under Article 370(3) and Constitution Orders 2019',
    content: 'C.O. 272 (5th August 2019) and C.O. 273 (6th August 2019) under Article 370(3): In exercise of powers conferred by clause (3) of Article 370 read with clause (1), the President declared that all provisions of the Constitution of India, as amended from time to time, without any modifications or exceptions, shall apply to the State of Jammu and Kashmir, superseding C.O. 1954 and rendering previous exceptions inoperative.',
    keyTerms: ['Article 370', 'C.O. 272', 'C.O. 273', 'Jammu and Kashmir Reorganisation', 'Constitutional Integration'],
    crossReferences: ['CONST_ART_1', 'CONST_ART_367'],
    importanceWeight: 0.89
  },

  // ==========================================
  // 2. THE INDIAN PENAL CODE, 1860
  // ==========================================
  {
    id: 'IPC_SEC_34',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter II - General Explanations',
    sectionOrArticle: 'Section 34',
    title: 'Acts Done by Several Persons in Furtherance of Common Intention',
    content: 'When a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone.',
    keyTerms: ['Common Intention', 'Joint Liability', 'Vicarious Criminal Liability', 'Prior Concert', 'Participation in Act'],
    crossReferences: ['IPC_SEC_149', 'IPC_SEC_120A', 'IPC_SEC_109'],
    importanceWeight: 0.95
  },
  {
    id: 'IPC_SEC_76_79',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter IV - General Exceptions',
    sectionOrArticle: 'Sections 76 & 79',
    title: 'Act Done by Mistake of Fact Believing Self Bound / Justified by Law',
    content: 'Section 76: Nothing is an offence which is done by a person who is, or who by reason of a mistake of fact and not by reason of a mistake of law in good faith believes himself to be, bound by law to do it. Section 79: Nothing is an offence which is done by any person who is justified by law, or who by reason of a mistake of fact and not of law in good faith believes himself to be justified by law.',
    keyTerms: ['Mistake of Fact', 'Ignorantia Facti Excusat', 'Ignorantia Juris Non Excusat', 'Good Faith', 'General Exceptions'],
    crossReferences: ['IPC_SEC_52', 'IPC_SEC_80', 'IPC_SEC_96'],
    importanceWeight: 0.88
  },
  {
    id: 'IPC_SEC_84',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter IV - General Exceptions',
    sectionOrArticle: 'Section 84',
    title: 'Act of a Person of Unsound Mind (Insanity Defence)',
    content: 'Nothing is an offence which is done by a person who, at the time of doing it, by reason of unsoundness of mind, is incapable of knowing the nature of the act, or that he is doing what is either wrong or contrary to law.',
    keyTerms: ['Unsoundness of Mind', 'Insanity Defence', 'McNaughten Rule', 'Legal Insanity vs Medical Insanity', 'Mens Rea absence'],
    crossReferences: ['IPC_SEC_85', 'IPC_SEC_86'],
    importanceWeight: 0.92
  },
  {
    id: 'IPC_SEC_96_100',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter IV - Right of Private Defence',
    sectionOrArticle: 'Sections 96, 97, 99 & 100',
    title: 'Right of Private Defence of Body and When it Extends to Causing Death',
    content: 'Section 96: Nothing is an offence done in exercise of right of private defence. Section 97: Right to defend own body and property. Section 99: Proportionality principle—right in no case extends to inflicting more harm than necessary for defence. Section 100: Private defence of the body extends to causing death against assault causing reasonable apprehension of death, grievous hurt, rape, unnatural lust, kidnapping/abduction, wrongful confinement, or throwing/administering acid.',
    keyTerms: ['Private Defence', 'Self Defence', 'Causing Death in Self Defence', 'Proportionality', 'Reasonable Apprehension', 'Section 100 IPC'],
    crossReferences: ['IPC_SEC_300', 'IPC_SEC_101', 'IPC_SEC_103'],
    importanceWeight: 0.96
  },
  {
    id: 'IPC_SEC_120A_B',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter VA - Criminal Conspiracy',
    sectionOrArticle: 'Sections 120A & 120B',
    title: 'Criminal Conspiracy Definition and Punishment',
    content: '120A: When two or more persons agree to do, or cause to be done, (1) an illegal act, or (2) an act which is not illegal by illegal means, such an agreement is designated a criminal conspiracy. Proviso: Agreement to commit an offence constitutes conspiracy without overt act. 120B: Whoever is party to criminal conspiracy to commit offence punishable with death, imprisonment for life or rigorous imprisonment of 2 years+, punished as an abettor.',
    keyTerms: ['Criminal Conspiracy', 'Agreement to commit offence', 'Meeting of Minds', 'Joint Criminal Liability', 'Section 120B'],
    crossReferences: ['IPC_SEC_34', 'IPC_SEC_107'],
    importanceWeight: 0.90
  },
  {
    id: 'IPC_SEC_124A',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter VI - Offences Against the State',
    sectionOrArticle: 'Section 124A',
    title: 'Sedition',
    content: 'Whoever by words, either spoken or written, or by signs, or by visible representation, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards the Government established by law in India, shall be punished with imprisonment for life or fine. Explanations: Disaffection includes disloyalty and feelings of enmity; comments disapproving measures or administrative actions without exciting hatred/disaffection are not offences.',
    keyTerms: ['Sedition', 'Disaffection', 'Freedom of Speech', 'Kedarnath Singh Doctrine', 'Public Disorder Requirement'],
    crossReferences: ['CONST_ART_19', 'IPC_SEC_153A', 'IPC_SEC_505'],
    importanceWeight: 0.88
  },
  {
    id: 'IPC_SEC_149',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter VIII - Offences Against Public Tranquillity',
    sectionOrArticle: 'Section 149',
    title: 'Every Member of Unlawful Assembly Guilty of Offence in Common Object',
    content: 'If an offence is committed by any member of an unlawful assembly in prosecution of the common object of that assembly, or such as the members of that assembly knew to be likely to be committed in prosecution of that object, every person who, at the time of the committing of that offence, is a member of the same assembly, is guilty of that offence.',
    keyTerms: ['Unlawful Assembly', 'Common Object', 'Constructive Liability', 'Section 149 vs Section 34', 'Rioting'],
    crossReferences: ['IPC_SEC_34', 'IPC_SEC_141', 'IPC_SEC_146'],
    importanceWeight: 0.91
  },
  {
    id: 'IPC_SEC_191_193',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XI - False Evidence and Offences against Public Justice',
    sectionOrArticle: 'Sections 191 & 193',
    title: 'Giving False Evidence (Perjury) and Fabricating False Evidence',
    content: 'Section 191: Whoever, being legally bound by an oath or express provision of law to state truth, makes any statement which is false and which he either knows or believes to be false or does not believe to be true, gives false evidence. Section 193: Punishment for giving or fabricating false evidence in any stage of a judicial proceeding is imprisonment up to seven years and fine; in any other case, imprisonment up to three years.',
    keyTerms: ['Perjury', 'False Evidence', 'Fabricating False Evidence', 'Judicial Proceedings', 'Contempt of Justice'],
    crossReferences: ['IPC_SEC_192', 'IPC_SEC_201'],
    importanceWeight: 0.85
  },
  {
    id: 'IPC_SEC_299_300',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XVI - Offences Affecting the Human Body',
    sectionOrArticle: 'Sections 299 & 300',
    title: 'Culpable Homicide and Murder',
    content: 'Section 299 defines Culpable Homicide: causing death by act with intention of causing death, or causing bodily injury likely to cause death, or knowledge of causing death. Section 300 defines Murder: culpable homicide is murder if done with intention of causing death, or bodily injury known to be likely to cause death, or bodily injury sufficient in ordinary course of nature to cause death. Exceptions when Culpable Homicide is not Murder: 1. Grave and sudden provocation; 2. Exceeding right of private defence in good faith; 3. Public servant exceeding powers in good faith; 4. Sudden fight in heat of passion; 5. Death with consent of person above 18.',
    keyTerms: ['Culpable Homicide', 'Murder', 'Section 300 Exceptions', 'Grave and Sudden Provocation', 'Sudden Fight', 'Intention vs Knowledge'],
    crossReferences: ['IPC_SEC_302', 'IPC_SEC_304', 'IPC_SEC_304A', 'CONST_ART_21'],
    importanceWeight: 1.0
  },
  {
    id: 'IPC_SEC_302_304',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XVI - Offences Affecting the Human Body',
    sectionOrArticle: 'Sections 302, 304 & 304A',
    title: 'Punishments for Murder, Culpable Homicide, and Rash/Negligent Death',
    content: 'Section 302: Punishment for murder is death or imprisonment for life and fine. Section 304: Culpable homicide not amounting to murder punished with imprisonment for life or up to 10 years if done with intention; up to 10 years or fine if done with knowledge. Section 304A: Causing death by doing any rash or negligent act not amounting to culpable homicide punished with imprisonment up to 2 years or fine.',
    keyTerms: ['Punishment for Murder', 'Culpable Homicide Part I and II', 'Rash and Negligent Act', 'Section 304A', 'Vehicular Manslaughter'],
    crossReferences: ['IPC_SEC_299', 'IPC_SEC_300', 'IPC_SEC_304B'],
    importanceWeight: 0.96
  },
  {
    id: 'IPC_SEC_304B',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XVI - Offences Affecting the Human Body',
    sectionOrArticle: 'Section 304B',
    title: 'Dowry Death',
    content: '(1) Where the death of a woman is caused by burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage, and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or relative of husband for or in connection with any demand for dowry, such death shall be called "dowry death". (2) Punishment: imprisonment for a term not less than seven years, which may extend to imprisonment for life.',
    keyTerms: ['Dowry Death', 'Seven Years Rule', 'Cruelty Soon Before Death', 'Presumption under Law', 'Section 498A IPC'],
    crossReferences: ['IPC_SEC_498A', 'IPC_SEC_306'],
    importanceWeight: 0.92
  },
  {
    id: 'IPC_SEC_375_376',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XVI - Sexual Offences',
    sectionOrArticle: 'Sections 375 & 376',
    title: 'Rape Definition, Consent Standards and Enhanced Punishments',
    content: 'Section 375 defines rape across seven descriptions: against will, without consent, fear of death/hurt, false marital belief, unsoundness/intoxication, under 18 years, unable to communicate consent. Explanation 2 defines consent as unequivocal voluntary agreement; physical non-resistance does not imply consent. Section 376: Rigorous imprisonment not less than ten years extending to life. Section 376(2) provides aggravated rape penalties (police, public servant, hospital, gang rape). Section 376AB/DB imposes life imprisonment or death for rape on female under 12 years.',
    keyTerms: ['Rape', 'Consent Definition', 'Aggravated Rape', 'Gang Rape', 'POCSO alignment', 'Criminal Law Amendment'],
    crossReferences: ['IPC_SEC_354', 'IPC_SEC_354A', 'CONST_ART_21'],
    importanceWeight: 0.97
  },
  {
    id: 'IPC_SEC_378_383',
    sourceDoc: 'Indian Penal Code',
    domain: 'Property',
    partOrChapter: 'Chapter XVII - Offences Against Property',
    sectionOrArticle: 'Sections 378, 379 & 383',
    title: 'Theft and Extortion',
    content: 'Section 378 Theft: Intending to take dishonestly any movable property out of possession of any person without consent, moving that property in order to such taking. Punishment (379): Imprisonment up to 3 years or fine. Section 383 Extortion: Intentionally putting any person in fear of injury and thereby dishonestly inducing delivery of property or valuable security. Punishment (384): Imprisonment up to 3 years or fine.',
    keyTerms: ['Theft', 'Dishonest Intention', 'Movable Property', 'Severance from Earth', 'Extortion', 'Fear of Injury'],
    crossReferences: ['IPC_SEC_390', 'IPC_SEC_403', 'IPC_SEC_415'],
    importanceWeight: 0.90
  },
  {
    id: 'IPC_SEC_390_395',
    sourceDoc: 'Indian Penal Code',
    domain: 'Property',
    partOrChapter: 'Chapter XVII - Offences Against Property',
    sectionOrArticle: 'Sections 390, 391 & 395',
    title: 'Robbery and Dacoity',
    content: 'Section 390: In all robbery there is either theft or extortion. Theft is robbery if in committing it the offender voluntarily causes or attempts to cause death, hurt or wrongful restraint. Section 391 Dacoity: When five or more persons conjointly commit or attempt robbery. Section 395: Punishment for dacoity is imprisonment for life or rigorous imprisonment up to ten years.',
    keyTerms: ['Robbery', 'Dacoity', 'Five or More Persons', 'Aggravated Theft', 'Dacoity with Murder'],
    crossReferences: ['IPC_SEC_378', 'IPC_SEC_383', 'IPC_SEC_396'],
    importanceWeight: 0.91
  },
  {
    id: 'IPC_SEC_405_409',
    sourceDoc: 'Indian Penal Code',
    domain: 'Property',
    partOrChapter: 'Chapter XVII - Criminal Breach of Trust',
    sectionOrArticle: 'Sections 405 & 409',
    title: 'Criminal Breach of Trust and Aggravated Breach by Public Servant or Banker',
    content: 'Section 405: Whoever, being in any manner entrusted with property or dominion over property, dishonestly misappropriates, converts to own use, or uses in violation of law or contract, commits criminal breach of trust. Explanations: Employer deducting employee provident fund or insurance and defaulting is deemed to have committed breach of trust. Section 409: Breach of trust by public servant, banker, merchant, broker, or attorney punishable with imprisonment for life or up to 10 years.',
    keyTerms: ['Criminal Breach of Trust', 'Entrustment of Property', 'Dominion', 'Provident Fund Default', 'Fiduciary Breach'],
    crossReferences: ['IPC_SEC_403', 'IPC_SEC_415', 'IPC_SEC_420'],
    importanceWeight: 0.93
  },
  {
    id: 'IPC_SEC_415_420',
    sourceDoc: 'Indian Penal Code',
    domain: 'Property',
    partOrChapter: 'Chapter XVII - Cheating',
    sectionOrArticle: 'Sections 415 & 420',
    title: 'Cheating and Dishonestly Inducing Delivery of Property',
    content: 'Section 415: Deceiving any person, fraudulently or dishonestly inducing them to deliver property, or consent to retain property, or intentionally inducing them to do or omit anything causing damage or harm in body, mind, reputation or property. Section 420: Cheating and dishonestly inducing delivery of property, or alteration/destruction of valuable security, punishable with imprisonment up to seven years and fine.',
    keyTerms: ['Cheating', 'Section 420 IPC', 'Inducing Delivery of Property', 'Fraudulent Deception', 'Valuable Security'],
    crossReferences: ['IPC_SEC_24', 'IPC_SEC_25', 'IPC_SEC_405', 'IPC_SEC_463'],
    importanceWeight: 0.96
  },
  {
    id: 'IPC_SEC_463_465',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XVIII - Forgery and False Documents',
    sectionOrArticle: 'Sections 463, 464 & 465',
    title: 'Forgery and Making a False Document or Electronic Record',
    content: 'Section 463: Making any false document or false electronic record with intent to cause damage, injury, support claim, or enter contract, or with intent to commit fraud. Section 464: Making false document or electronic record, affixing electronic signature without authority, or dishonestly altering document. Section 465: Punishment for forgery is imprisonment up to two years or fine.',
    keyTerms: ['Forgery', 'False Document', 'Electronic Record', 'Electronic Signature', 'Section 464 IPC', 'Digital Forgery'],
    crossReferences: ['IPC_SEC_468', 'IPC_SEC_471', 'IT_RULES_SEC_3'],
    importanceWeight: 0.92
  },
  {
    id: 'IPC_SEC_498A',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XXA - Cruelty by Husband or Relatives',
    sectionOrArticle: 'Section 498A',
    title: 'Husband or Relative of Husband of a Woman Subjecting Her to Cruelty',
    content: 'Whoever, being the husband or relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term up to three years and fine. Cruelty defined as: (a) wilful conduct likely to drive woman to commit suicide or cause grave injury to life, limb or health (mental or physical); or (b) harassment with a view to coercing her or relative to meet unlawful property or valuable security demands.',
    keyTerms: ['Cruelty to Married Woman', 'Section 498A', 'Matrimonial Cruelty', 'Dowry Harassment', 'Mental and Physical Cruelty'],
    crossReferences: ['IPC_SEC_304B', 'IPC_SEC_306', 'CONST_ART_21'],
    importanceWeight: 0.94
  },
  {
    id: 'IPC_SEC_499_500',
    sourceDoc: 'Indian Penal Code',
    domain: 'Criminal',
    partOrChapter: 'Chapter XXI - Defamation',
    sectionOrArticle: 'Sections 499 & 500',
    title: 'Defamation and the Ten Statutory Exceptions',
    content: 'Section 499: Whoever, by words spoken or written, signs, or visible representation, makes or publishes imputation concerning any person intending or knowing likely to harm reputation. Ten Exceptions: 1. Imputation of truth for public good; 2. Public conduct of public servants; 3. Conduct of person on public question; 4. Publication of reports of court proceedings; 5. Merits of case decided in court; 6. Merits of public performance; 7. Censure passed in good faith by person in lawful authority; 8. Accusation preferred in good faith to authorised person; 9. Imputation made in good faith for protection of interests or public good; 10. Caution intended for good of person conveyed. Section 500: Imprisonment up to two years or fine.',
    keyTerms: ['Defamation', 'Ten Exceptions', 'Public Good', 'Good Faith', 'Privilege', 'Reputation Rights', 'Section 499 IPC'],
    crossReferences: ['CONST_ART_19', 'IPC_SEC_501', 'IPC_SEC_502'],
    importanceWeight: 0.93
  },

  // ==========================================
  // 3. INFORMATION TECHNOLOGY ACT & RULES, 2000
  // ==========================================
  {
    id: 'IT_RULES_SEC_3_5',
    sourceDoc: 'Information Technology Rules',
    domain: 'Cyber & Tech',
    partOrChapter: 'Rules 3, 4 & 5',
    sectionOrArticle: 'Rules 3-5',
    title: 'Authentication, Creation, and Verification of Digital Signatures',
    content: 'Rule 3: Information authenticated by means of Digital Signature created and verified by cryptography using Public Key Cryptography and asymmetric cryptography with hash function. Rule 4: Signer applies hash function to electronic record computing unique hash result, transforming it using signer’s private key into a Digital Signature. Rule 5: Verification accomplished by computing new hash of electronic record and verifying with signer’s public key that signature matches original record without alteration.',
    keyTerms: ['Digital Signature', 'Public Key Cryptography', 'Asymmetric Cryptography', 'Private Key', 'Hash Function', 'Digital Signature Verification'],
    crossReferences: ['IT_RULES_SEC_6', 'IT_RULES_GLOSSARY', 'IPC_SEC_464'],
    importanceWeight: 0.95
  },
  {
    id: 'IT_RULES_SEC_6_7',
    sourceDoc: 'Information Technology Rules',
    domain: 'Cyber & Tech',
    partOrChapter: 'Rules 6 & 7',
    sectionOrArticle: 'Rules 6-7',
    title: 'Technical Standards & Digital Signature Certificate Requirements',
    content: 'Rule 6 Standards: PKIX for Public Key Infrastructure; ITU X.509 version 3 for Digital Signature Certificates and CRL; X.500 for directory DAP/LDAP; DSA & RSA public key algorithms; SHA-1 & MD5 digital hash functions; PKCS#1, PKCS#7, PKCS#10, PKCS#12 for encryption and key transport. Rule 7: Digital Signature Certificate must contain serial number, signature algorithm identifier, issuer name, validity period, subscriber name and subscriber public key information.',
    keyTerms: ['ITU X.509 v3', 'PKIX Architecture', 'PKCS Standards', 'RSA Algorithm', 'SHA Hash Function', 'Certificate Revocation List CRL'],
    crossReferences: ['IT_RULES_SEC_3_5', 'IT_RULES_SEC_8'],
    importanceWeight: 0.91
  },
  {
    id: 'IT_RULES_SEC_8_11',
    sourceDoc: 'Information Technology Rules',
    domain: 'Cyber & Tech',
    partOrChapter: 'Rules 8-11',
    sectionOrArticle: 'Rules 8-11',
    title: 'Licensing of Certifying Authorities and Capital Prerequisites',
    content: 'Rule 8: Qualifications for Certifying Authority license: Individual must have capital of 5 crore rupees+; Company must have paid-up capital of not less than 5 crore rupees and net worth not less than 50 crore rupees. Foreign equity restricted to maximum 49%. Performance bond or banker guarantee of Rs. 5 crore (or Rs. 10 crore under second proviso) valid for 6 years. Rule 9: Infrastructure facilities must be located within India. Rule 11: Non-refundable application fee of Rs. 25,000; renewal fee Rs. 5,000.',
    keyTerms: ['Certifying Authority Licensing', 'Paid Up Capital 5 Crores', 'Net Worth 50 Crores', 'Performance Bond', 'Banker Guarantee', 'Infrastructure Location in India'],
    crossReferences: ['IT_RULES_SEC_14', 'IT_RULES_SCH_II'],
    importanceWeight: 0.89
  },
  {
    id: 'IT_RULES_SCH_II_SEC',
    sourceDoc: 'Information Technology Rules',
    domain: 'Cyber & Tech',
    partOrChapter: 'Schedule II - IT Security Guidelines',
    sectionOrArticle: 'Schedule II (Paras 4, 6, 8, 10)',
    title: 'Physical, Network, Audit and Cryptographic Security Guidelines for CAs',
    content: 'Schedule II mandates: Para 4: Physical access control with biometric systems, CCTV monitoring 24/7, fire-resistant construction. Para 6: System access control with encrypted passwords resistant to dictionary attacks, automatic terminal time-out, audit trails preserved for at least two years. Para 8: Data centre security, media movement logging in impact-resistant containers. Para 10: Audit trail verification, synchronization with Indian Standard Time (IST), dual control key management (split-knowledge technique).',
    keyTerms: ['IT Security Guidelines', 'Biometric Access Control', 'Split-Knowledge Technique', 'Audit Trail 2 Years', 'IST Synchronization', 'Disaster Recovery Plan'],
    crossReferences: ['IT_RULES_SEC_19', 'IT_RULES_SCH_III'],
    importanceWeight: 0.93
  },
  {
    id: 'IT_RULES_TRIBUNAL_PROC',
    sourceDoc: 'Information Technology Rules',
    domain: 'Cyber & Tech',
    partOrChapter: 'Cyber Regulations Appellate Tribunal Rules 2000',
    sectionOrArticle: 'Rules 3, 6, 8 & 14',
    title: 'Cyber Regulations Appellate Tribunal Filing and Adjudication Procedures',
    content: 'Rule 3: Application to Cyber Regulations Appellate Tribunal filed under Section 57 in Form-1 in six complete sets in paper-book form. Rule 6: Application fee of Rs. 2,000 via crossed Demand Draft. Rule 8: Accompanying certified orders, index of documents, and vakalatnama. Rule 14: Tribunal shall decide cases as far as possible within six months. Rule 16: Ex-parte hearing provisions. Rule 26: Powers and duties of Registrar.',
    keyTerms: ['Cyber Regulations Appellate Tribunal', 'Section 57 IT Act', 'Form-1 Filing', 'Tribunal Procedure Rules', 'Six Months Disposal Target'],
    crossReferences: ['CONST_ART_323A', 'IT_RULES_GLOSSARY'],
    importanceWeight: 0.87
  },
  {
    id: 'IT_RULES_GLOSSARY',
    sourceDoc: 'Information Technology Rules',
    domain: 'Cyber & Tech',
    partOrChapter: 'Schedule V - Glossary',
    sectionOrArticle: 'Schedule V',
    title: 'Authoritative Glossary of Cryptographic and Legal Information Assets',
    content: 'Schedule V definitions: Asymmetric Crypto System: secure key pair consisting of private key for signing and public key for verifying. Audit Trail: chronological record of system activities reconstructing sequence of states. Authenticated Record: signed document with digital signature verified by relying party. Certificate Revocation List (CRL): periodically issued list of revoked/suspended certificates. Non-repudiation: proof of origin or delivery preventing false denial by sender or recipient. Trustworthy System: hardware, software, and procedures reasonably secure from intrusion and misuse.',
    keyTerms: ['Asymmetric Crypto System', 'Audit Trail', 'Non-repudiation', 'CRL', 'Trustworthy System', 'Private Key', 'Public Key', 'Schedule V'],
    crossReferences: ['IT_RULES_SEC_3_5', 'IT_RULES_SEC_6_7'],
    importanceWeight: 0.90
  }
];
