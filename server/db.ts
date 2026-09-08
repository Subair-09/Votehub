import { MongoClient, Db } from 'mongodb';

export interface CandidateDoc {
  id: string;
  name: string;
  party: string;
  position: string;
  rank: number;
  description: string;
  votes: number;
  image: string;
  isLeader?: boolean;
  manifesto?: string[];
  education?: string;
  experience?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SignupCodeDoc {
  id: string;
  code: string;
  status: 'unused' | 'assigned' | 'revoked';
  assignedTo?: string;
  department?: string;
  createdAt: string;
  usedAt?: string;
  revokedAt?: string;
}

export interface VoteDoc {
  voterId: string;
  candidateId: string;
  candidateName: string;
  position: string;
  timestamp: string;
  ipAddress?: string;
  verificationHash: string;
}

export interface PositionDoc {
  id: string;
  title: string;
  department?: string;
  maxSelections?: number;
  description?: string;
  createdAt: string;
}

export interface ActivityLogDoc {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
}

// Initial seed data for MongoDB / Fallback
const SEED_POSITIONS: PositionDoc[] = [
  {
    id: 'pos-1',
    title: 'President',
    department: 'Executive Council',
    maxSelections: 1,
    description: 'Chief Executive Officer and head of student leadership governance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pos-2',
    title: 'Vice President',
    department: 'Executive Council',
    maxSelections: 1,
    description: 'Deputy executive lead and coordinator of union directorates',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pos-3',
    title: 'General Secretary',
    department: 'Secretariat',
    maxSelections: 1,
    description: 'Chief administrative custodian of records, minutes, and notices',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pos-4',
    title: 'Treasurer',
    department: 'Finance Directorate',
    maxSelections: 1,
    description: 'Chief fiscal officer overseeing funds, allocations, and audits',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pos-5',
    title: 'Public Relations Officer',
    department: 'Communications Bureau',
    maxSelections: 1,
    description: 'Spokesperson for student interest, media communications, and alerts',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pos-6',
    title: 'Director of Socials',
    department: 'Student Life & Culture',
    maxSelections: 1,
    description: 'Organizer of campus galas, recreational activities, and cultural weeks',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pos-7',
    title: 'Director of Welfare',
    department: 'Student Affairs',
    maxSelections: 1,
    description: 'Advocate for campus amenities, medical welfare, and student well-being',
    createdAt: new Date().toISOString(),
  },
];
const SEED_CANDIDATES: CandidateDoc[] = [
  {
    id: 'aisha-bello',
    name: 'Aisha Bello',
    party: 'Better Tomorrow Movement',
    position: 'President',
    rank: 1,
    description: 'A strong voice for youth empowerment and sustainable development.',
    votes: 842,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    isLeader: true,
    manifesto: [
      'Empowering youth tech initiatives and vocational training programs',
      'Implementing 100% renewable energy projects across community centers',
      'Establishing transparent digital governance and public fund audits',
    ],
    education: 'M.Sc. Public Administration & Public Policy',
    experience: '8+ years community leadership & sustainable development advocate',
  },
  {
    id: 'daniel-okafor',
    name: 'Daniel Okafor',
    party: 'Unity First',
    position: 'Vice President',
    rank: 2,
    description: 'Focused on innovation, job creation and a better future for all.',
    votes: 623,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    manifesto: [
      'Fostering local entrepreneurship micro-grant funds',
      'Upgrading digital community infrastructure and broadband',
      'Modernizing public health and safety protocols',
    ],
    education: 'B.Sc. Computer Engineering & MBA',
    experience: 'Tech startup founder and civic innovation advisor',
  },
  {
    id: 'chinwe-nwosu',
    name: 'Chinwe Nwosu',
    party: 'Progressive Alliance',
    position: 'General Secretary',
    rank: 3,
    description: 'Dedicated to transparent governance and educational reforms.',
    votes: 489,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80',
    manifesto: [
      'Universal educational resource allocation for secondary institutions',
      'Community open-data portals for civic oversight',
      'Inclusive community advisory councils with equal representation',
    ],
    education: 'LL.B. Law & M.A. International Relations',
    experience: 'Civil rights attorney and civic education director',
  },
  {
    id: 'ibrahim-musa',
    name: 'Ibrahim Musa',
    party: 'Forward Nigeria',
    position: 'Treasurer',
    rank: 4,
    description: 'Championing fiscal responsibility and youth empowerment.',
    votes: 312,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    manifesto: [
      'Zero-leakage public budgeting and real-time ledger accounting',
      'Small business credit guarantees and mentorship networks',
      'Community infrastructure renovation projects',
    ],
    education: 'FCA, B.Sc. Accounting & Financial Analytics',
    experience: 'Chief Financial Officer and municipal economic planner',
  },
  {
    id: 'fatima-aliyu',
    name: 'Fatima Aliyu',
    party: 'Youth Action Coalition',
    position: 'Director of Socials',
    rank: 5,
    description: 'Building community engagement, cultural exchanges, and vibrant campus life.',
    votes: 145,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80',
    manifesto: [
      'Revitalizing community arts festivals and cultural hubs',
      'Student and youth mental health support networks',
      'Extracurricular sports league funding and equipment grants',
    ],
    education: 'B.A. Mass Communication & Digital Media',
    experience: 'Youth festival organizer & creative director',
  },
  {
    id: 'samuel-adeleke',
    name: 'Samuel Adeleke',
    party: 'Civic Renewal Initiative',
    position: 'Public Relations Officer',
    rank: 6,
    description: 'Fostering open communications and student advocacy across all departments.',
    votes: 76,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    manifesto: [
      'Weekly transparent press briefings and open-mic student forums',
      'Mobile SMS voting and civic notification alerts',
      'Student rights defense bureau and conflict mediation',
    ],
    education: 'B.Sc. Journalism & Political Science',
    experience: 'Student union press secretary & debate coach',
  },
];

const SEED_CODES: SignupCodeDoc[] = [
  { id: '1', code: '8492015', status: 'unused', createdAt: '2025-05-10T10:15:00Z' },
  { id: '2', code: '3910582', status: 'assigned', assignedTo: 'Oluwaseun Adeyemi', department: 'Computer Science', createdAt: '2025-05-10T10:30:00Z' },
  { id: '3', code: '7241903', status: 'unused', createdAt: '2025-05-10T11:00:00Z' },
  { id: '4', code: '1583094', status: 'revoked', department: 'Mechanical Engineering', createdAt: '2025-05-10T11:15:00Z', revokedAt: '2025-05-11T09:00:00Z' },
  { id: '5', code: '9024183', status: 'unused', createdAt: '2025-05-10T12:00:00Z' },
  { id: '6', code: '4820195', status: 'assigned', assignedTo: 'Fatima Abubakar', department: 'Economics', createdAt: '2025-05-10T12:20:00Z' },
  { id: '7', code: '6391024', status: 'unused', createdAt: '2025-05-10T13:45:00Z' },
];

const SEED_ACTIVITY: ActivityLogDoc[] = [
  { id: 'act-1', type: 'vote', title: 'New vote recorded', description: 'Voter #VH-2025-9842 verified & recorded', timestamp: new Date().toISOString(), relativeTime: '2 mins ago' },
  { id: 'act-2', type: 'audit', title: 'Ledger integrity verified', description: 'Merkle root hash matches network validator', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), relativeTime: '5 mins ago' },
  { id: 'act-3', type: 'voter', title: 'Voter accredited', description: 'Voter #VH-2025-9841 identity accredited', timestamp: new Date(Date.now() - 14 * 60000).toISOString(), relativeTime: '14 mins ago' },
  { id: 'act-4', type: 'vote', title: 'New vote recorded', description: 'Voter #VH-2025-9840 verified & recorded', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), relativeTime: '22 mins ago' },
];

// In-Memory state for graceful fallback when MONGODB_URI is not set or during local development
let inMemoryCandidates: CandidateDoc[] = [...SEED_CANDIDATES];
let inMemoryPositions: PositionDoc[] = [...SEED_POSITIONS];
let inMemoryCodes: SignupCodeDoc[] = [...SEED_CODES];
let inMemoryVotes: VoteDoc[] = [];
let inMemoryActivity: ActivityLogDoc[] = [...SEED_ACTIVITY];

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;
let lastConnectionError: string | null = null;

export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (db) {
    return db;
  }

  if (isConnecting) {
    return null;
  }

  try {
    isConnecting = true;
    lastConnectionError = null;
    console.log('[MongoDB] Connecting to MongoDB instance...');
    client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    const dbName = process.env.MONGODB_DB_NAME || 'votehub';
    db = client.db(dbName);
    console.log(`[MongoDB] Connected successfully to database: "${dbName}"`);

    // Ensure candidate collections are seeded
    const count = await db.collection('candidates').countDocuments();
    if (count === 0) {
      console.log('[MongoDB] Seeding initial candidate records...');
      await db.collection('candidates').insertMany(SEED_CANDIDATES);
    }

    const codeCount = await db.collection('signup_codes').countDocuments();
    if (codeCount === 0) {
      console.log('[MongoDB] Seeding initial 7-digit signup codes...');
      await db.collection('signup_codes').insertMany(SEED_CODES);
    }

    const actCount = await db.collection('activity_logs').countDocuments();
    if (actCount === 0) {
      await db.collection('activity_logs').insertMany(SEED_ACTIVITY);
    }

    const posCount = await db.collection('positions').countDocuments();
    if (posCount === 0) {
      console.log('[MongoDB] Seeding initial election positions...');
      await db.collection('positions').insertMany(SEED_POSITIONS);
    }

    isConnecting = false;
    return db;
  } catch (err: any) {
    isConnecting = false;
    lastConnectionError = err.message || 'Failed to connect to MongoDB';
    console.error('[MongoDB] Connection failed:', lastConnectionError);
    return null;
  }
}

export async function getDbStatus() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return {
      connected: false,
      configured: false,
      usingFallback: true,
      database: process.env.MONGODB_DB_NAME || 'votehub (in-memory)',
      message: 'MONGODB_URI is not set in environment. Running in active in-memory database mode with full CRUD capability.',
    };
  }

  try {
    const database = await getDb();
    if (database) {
      return {
        connected: true,
        configured: true,
        usingFallback: false,
        database: database.databaseName,
        message: 'Successfully connected to live MongoDB instance.',
      };
    }
  } catch (err: any) {
    // handled below
  }

  return {
    connected: false,
    configured: true,
    usingFallback: true,
    database: process.env.MONGODB_DB_NAME || 'votehub',
    error: lastConnectionError,
    message: 'Configured MONGODB_URI could not be reached. Operating in fallback mode to maintain service continuity.',
  };
}

// Candidates Operations
export async function getAllCandidates(): Promise<CandidateDoc[]> {
  const database = await getDb();
  if (database) {
    const list = await database.collection<CandidateDoc>('candidates').find({}).sort({ rank: 1 }).toArray();
    return list.map(({ _id, ...rest }: any) => rest);
  }
  return inMemoryCandidates;
}

export async function addCandidate(candidate: Omit<CandidateDoc, 'rank' | 'votes'> & { rank?: number; votes?: number }): Promise<CandidateDoc> {
  const database = await getDb();
  const newCandidate: CandidateDoc = {
    id: candidate.id || `candidate-${Date.now()}`,
    name: candidate.name,
    party: candidate.party || 'Independent',
    position: candidate.position || 'Candidate',
    rank: candidate.rank || (inMemoryCandidates.length + 1),
    description: candidate.description || '',
    votes: candidate.votes || 0,
    image: candidate.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    manifesto: candidate.manifesto || [],
    education: candidate.education || '',
    experience: candidate.experience || '',
    createdAt: new Date(),
  };

  if (database) {
    await database.collection('candidates').insertOne(newCandidate);
  } else {
    inMemoryCandidates.push(newCandidate);
  }

  // Add activity log
  await recordActivity({
    id: `act-${Date.now()}`,
    type: 'candidate',
    title: 'New Candidate Registered',
    description: `${newCandidate.name} was added for ${newCandidate.position}`,
    timestamp: new Date().toISOString(),
    relativeTime: 'Just now',
  });

  return newCandidate;
}

export async function updateCandidate(id: string, updates: Partial<CandidateDoc>): Promise<CandidateDoc | null> {
  const database = await getDb();
  if (database) {
    await database.collection('candidates').updateOne({ id }, { $set: { ...updates, updatedAt: new Date() } });
    const updated = await database.collection<CandidateDoc>('candidates').findOne({ id });
    return updated ? (({ _id, ...rest }: any) => rest)(updated) : null;
  }

  const idx = inMemoryCandidates.findIndex((c) => c.id === id);
  if (idx !== -1) {
    inMemoryCandidates[idx] = { ...inMemoryCandidates[idx], ...updates, updatedAt: new Date() };
    return inMemoryCandidates[idx];
  }
  return null;
}

// Voting Operations
export async function recordVote(
  candidateId: string,
  voterId: string,
  voterName?: string
): Promise<{ success: boolean; totalVotes: number; candidate: CandidateDoc | null; position: string }> {
  const database = await getDb();
  const hash = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);

  // 1. Locate the candidate to determine their contesting position
  let candidateObj: CandidateDoc | null = null;
  if (database) {
    const doc = await database.collection<CandidateDoc>('candidates').findOne({ id: candidateId });
    if (doc) candidateObj = (({ _id, ...rest }: any) => rest)(doc);
  } else {
    candidateObj = inMemoryCandidates.find((c) => c.id === candidateId) || null;
  }

  if (!candidateObj) {
    throw new Error('Candidate not found.');
  }

  const positionTitle = candidateObj.position || 'General';

  // 2. Strict Per-Position Vote Validation: Check if voter already cast a vote for this position
  if (database) {
    const existing = await database.collection('votes').findOne({
      voterId,
      position: { $regex: new RegExp(`^${positionTitle.trim()}$`, 'i') },
    });
    if (existing) {
      throw new Error(
        `You have already cast a ballot for the office of ${positionTitle}. Each voter is only permitted to vote for one candidate per office.`
      );
    }
  } else {
    const existing = inMemoryVotes.find(
      (v) => v.voterId === voterId && v.position.trim().toLowerCase() === positionTitle.trim().toLowerCase()
    );
    if (existing) {
      throw new Error(
        `You have already cast a ballot for the office of ${positionTitle}. Each voter is only permitted to vote for one candidate per office.`
      );
    }
  }

  // 3. Prepare and persist vote record
  const voteRecord: VoteDoc = {
    voterId,
    candidateId,
    candidateName: candidateObj.name,
    position: positionTitle,
    timestamp: new Date().toISOString(),
    verificationHash: hash,
  };

  if (database) {
    await database.collection('candidates').updateOne(
      { id: candidateId },
      { $inc: { votes: 1 }, $set: { updatedAt: new Date() } }
    );
    await database.collection('votes').insertOne(voteRecord);
  } else {
    const idx = inMemoryCandidates.findIndex((c) => c.id === candidateId);
    if (idx !== -1) {
      inMemoryCandidates[idx].votes += 1;
      candidateObj = inMemoryCandidates[idx];
    }
    inMemoryVotes.push(voteRecord);
  }

  // Recalculate ranks
  await recalculateRanks();

  // Log activity
  await recordActivity({
    id: `act-${Date.now()}`,
    type: 'vote',
    title: 'New ballot cast',
    description: `Vote cast for ${voteRecord.candidateName} (${positionTitle}) by ${voterName || voterId}`,
    timestamp: new Date().toISOString(),
    relativeTime: 'Just now',
  });

  const all = await getAllCandidates();
  const totalVotes = all.reduce((acc, c) => acc + c.votes, 0);

  return { success: true, totalVotes, candidate: candidateObj, position: positionTitle };
}

export async function getVotesByVoter(voterId: string): Promise<VoteDoc[]> {
  const database = await getDb();
  if (database) {
    const list = await database.collection<VoteDoc>('votes').find({ voterId }).toArray();
    return list.map(({ _id, ...rest }: any) => rest);
  }
  return inMemoryVotes.filter((v) => v.voterId === voterId);
}

async function recalculateRanks() {
  const database = await getDb();
  if (database) {
    const candidates = await database.collection<CandidateDoc>('candidates').find({}).sort({ votes: -1 }).toArray();
    for (let i = 0; i < candidates.length; i++) {
      await database.collection('candidates').updateOne(
        { id: candidates[i].id },
        { $set: { rank: i + 1, isLeader: i === 0 } }
      );
    }
  } else {
    inMemoryCandidates.sort((a, b) => b.votes - a.votes);
    inMemoryCandidates.forEach((c, idx) => {
      c.rank = idx + 1;
      c.isLeader = idx === 0;
    });
  }
}

// 7-Digit Code Management
export async function getSignupCodes(): Promise<SignupCodeDoc[]> {
  const database = await getDb();
  if (database) {
    const codes = await database.collection<SignupCodeDoc>('signup_codes').find({}).toArray();
    return codes.map(({ _id, ...rest }: any) => rest);
  }
  return inMemoryCodes;
}

export async function generateSignupCodes(count: number = 5): Promise<SignupCodeDoc[]> {
  const database = await getDb();
  const generated: SignupCodeDoc[] = [];

  for (let i = 0; i < count; i++) {
    const code = Math.floor(1000000 + Math.random() * 9000000).toString();
    const item: SignupCodeDoc = {
      id: `code-${Date.now()}-${i}`,
      code,
      status: 'unused',
      createdAt: new Date().toISOString(),
    };
    generated.push(item);
  }

  if (database) {
    await database.collection('signup_codes').insertMany(generated);
  } else {
    inMemoryCodes = [...generated, ...inMemoryCodes];
  }

  return generated;
}

export async function assignSignupCode(id: string, assignedTo: string, department: string): Promise<SignupCodeDoc | null> {
  const database = await getDb();
  const update = { status: 'assigned' as const, assignedTo, department };

  if (database) {
    await database.collection('signup_codes').updateOne({ id }, { $set: update });
    const res = await database.collection<SignupCodeDoc>('signup_codes').findOne({ id });
    return res ? (({ _id, ...rest }: any) => rest)(res) : null;
  }

  const idx = inMemoryCodes.findIndex((c) => c.id === id);
  if (idx !== -1) {
    inMemoryCodes[idx] = { ...inMemoryCodes[idx], ...update };
    return inMemoryCodes[idx];
  }
  return null;
}

export async function revokeSignupCode(id: string): Promise<SignupCodeDoc | null> {
  const database = await getDb();
  const update = { status: 'revoked' as const, revokedAt: new Date().toISOString() };

  if (database) {
    await database.collection('signup_codes').updateOne({ id }, { $set: update });
    const res = await database.collection<SignupCodeDoc>('signup_codes').findOne({ id });
    return res ? (({ _id, ...rest }: any) => rest)(res) : null;
  }

  const idx = inMemoryCodes.findIndex((c) => c.id === id);
  if (idx !== -1) {
    inMemoryCodes[idx] = { ...inMemoryCodes[idx], ...update };
    return inMemoryCodes[idx];
  }
  return null;
}

// Activity & Audit Logs
export async function getActivityLogs(): Promise<ActivityLogDoc[]> {
  const database = await getDb();
  if (database) {
    const logs = await database.collection<ActivityLogDoc>('activity_logs').find({}).sort({ timestamp: -1 }).limit(20).toArray();
    return logs.map(({ _id, ...rest }: any) => rest);
  }
  return inMemoryActivity;
}

export async function recordActivity(log: ActivityLogDoc): Promise<void> {
  const database = await getDb();
  if (database) {
    await database.collection('activity_logs').insertOne(log);
  } else {
    inMemoryActivity.unshift(log);
    if (inMemoryActivity.length > 30) {
      inMemoryActivity.pop();
    }
  }
}

// ============================================================================
// Positions Management (Admin Entered & Controlled)
// ============================================================================
export async function getAllPositions(): Promise<PositionDoc[]> {
  const database = await getDb();
  if (database) {
    const list = await database.collection<PositionDoc>('positions').find({}).toArray();
    return list.map(({ _id, ...rest }: any) => rest);
  }
  return inMemoryPositions;
}

export async function addPosition(positionData: Omit<PositionDoc, 'id' | 'createdAt'> & { id?: string }): Promise<PositionDoc> {
  const database = await getDb();
  const newPos: PositionDoc = {
    id: positionData.id || `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: positionData.title.trim(),
    department: positionData.department?.trim() || 'General',
    maxSelections: Number(positionData.maxSelections) || 1,
    description: positionData.description?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  if (database) {
    await database.collection('positions').insertOne(newPos);
  } else {
    inMemoryPositions.push(newPos);
  }

  // Record administrative activity log
  await recordActivity({
    id: `act-${Date.now()}`,
    type: 'audit',
    title: 'Election position created',
    description: `Admin registered new position: ${newPos.title}`,
    timestamp: new Date().toISOString(),
    relativeTime: 'Just now',
  });

  return newPos;
}

export async function deletePosition(id: string): Promise<boolean> {
  const database = await getDb();
  let deleted = false;

  if (database) {
    const res = await database.collection('positions').deleteOne({ id });
    deleted = (res.deletedCount || 0) > 0;
  } else {
    const idx = inMemoryPositions.findIndex((p) => p.id === id);
    if (idx !== -1) {
      inMemoryPositions.splice(idx, 1);
      deleted = true;
    }
  }

  return deleted;
}

