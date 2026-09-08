import { Candidate } from '../data/candidates';

export interface IntegrationStatus {
  status: string;
  timestamp: string;
  mongodb: {
    connected: boolean;
    configured: boolean;
    usingFallback: boolean;
    database: string;
    message: string;
    error?: string | null;
  };
  cloudinary: {
    configured: boolean;
    cloudName: string | null;
    message: string;
  };
}

export interface SignupCodeItem {
  id: string;
  code: string;
  status: 'unused' | 'assigned' | 'revoked';
  assignedTo?: string;
  department?: string;
  createdAt: string;
  usedAt?: string;
  revokedAt?: string;
}

export interface ActivityLogItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
}

// 1. System Status
export async function getIntegrationStatus(): Promise<IntegrationStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status request failed');
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      timestamp: new Date().toISOString(),
      mongodb: {
        connected: false,
        configured: false,
        usingFallback: true,
        database: 'votehub (local)',
        message: 'Connecting to server API...',
      },
      cloudinary: {
        configured: false,
        cloudName: null,
        message: 'Connecting to media storage API...',
      },
    };
  }
}

// 2. Candidates
export async function getCandidatesApi(): Promise<Candidate[]> {
  try {
    const res = await fetch('/api/candidates');
    if (!res.ok) throw new Error('Failed to fetch candidates');
    const data = await res.json();
    return data.candidates || [];
  } catch (err) {
    console.warn('[API] Could not fetch candidates from API, falling back', err);
    return [];
  }
}

export async function createCandidateApi(data: Partial<Candidate>): Promise<Candidate> {
  const res = await fetch('/api/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create candidate');
  }
  const result = await res.json();
  return result.candidate;
}

// 3. Voting
export interface VoterVoteRecord {
  voterId: string;
  candidateId: string;
  candidateName: string;
  position: string;
  timestamp: string;
  verificationHash: string;
}

export async function castVoteApi(
  candidateId: string,
  voterId: string,
  voterName?: string
): Promise<{ success: boolean; totalVotes: number; candidate: Candidate | null; position?: string }> {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, voterId, voterName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit vote');
  }
  return await res.json();
}

export async function getVoterVotesApi(voterId: string): Promise<VoterVoteRecord[]> {
  try {
    const res = await fetch(`/api/votes/user/${encodeURIComponent(voterId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.votes || [];
  } catch (err) {
    console.warn('Failed to fetch voter votes:', err);
    return [];
  }
}

// 4. Cloudinary Media Storage Upload
export async function uploadToCloudinaryApi(
  file: File,
  folder: string = 'votehub/candidates'
): Promise<{ url: string; secure_url: string; public_id: string; provider: 'cloudinary' | 'fallback' }> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload image to storage');
  }

  const data = await res.json();
  return data;
}

// 5. Signup Codes Management
export async function getSignupCodesApi(): Promise<SignupCodeItem[]> {
  try {
    const res = await fetch('/api/codes');
    if (!res.ok) throw new Error('Failed to fetch codes');
    const data = await res.json();
    return data.codes || [];
  } catch (err) {
    console.warn('[API] Codes fetch failed', err);
    return [];
  }
}

export async function generateSignupCodesApi(count: number = 5): Promise<SignupCodeItem[]> {
  const res = await fetch('/api/codes/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate codes');
  }
  const data = await res.json();
  return data.codes;
}

export async function assignSignupCodeApi(id: string, assignedTo: string, department: string): Promise<SignupCodeItem> {
  const res = await fetch('/api/codes/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, assignedTo, department }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to assign code');
  }
  const data = await res.json();
  return data.code;
}

export async function revokeSignupCodeApi(id: string): Promise<SignupCodeItem> {
  const res = await fetch('/api/codes/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to revoke code');
  }
  const data = await res.json();
  return data.code;
}

// 6. Activity Logs
export async function getActivityLogsApi(): Promise<ActivityLogItem[]> {
  try {
    const res = await fetch('/api/activity');
    if (!res.ok) throw new Error('Failed to fetch activity');
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    return [];
  }
}

// 7. Election Positions API (Admin entered & managed)
export interface PositionItem {
  id: string;
  title: string;
  department?: string;
  maxSelections?: number;
  description?: string;
  createdAt?: string;
}

export async function getPositionsApi(): Promise<PositionItem[]> {
  try {
    const res = await fetch('/api/positions');
    if (!res.ok) throw new Error('Failed to fetch positions');
    const data = await res.json();
    return data.positions || [];
  } catch (err) {
    console.warn('[API] Fetch positions failed, using defaults', err);
    return [
      { id: 'pos-1', title: 'President', department: 'Executive Council', maxSelections: 1, description: 'Chief Executive Officer of the Student Union Government' },
      { id: 'pos-2', title: 'Vice President', department: 'Executive Council', maxSelections: 1, description: 'Deputy executive and coordinator of directorates' },
      { id: 'pos-3', title: 'General Secretary', department: 'Secretariat', maxSelections: 1, description: 'Chief administrative officer and keeper of union records' },
      { id: 'pos-4', title: 'Treasurer', department: 'Finance Directorate', maxSelections: 1, description: 'Oversees union fiscal policies and budgetary audits' },
      { id: 'pos-5', title: 'Public Relations Officer', department: 'Communications Bureau', maxSelections: 1, description: 'Official spokesperson and student media lead' },
      { id: 'pos-6', title: 'Director of Socials', department: 'Student Life & Culture', maxSelections: 1, description: 'Coordinates social engagements, cultural galas, and events' },
      { id: 'pos-7', title: 'Director of Welfare', department: 'Student Affairs', maxSelections: 1, description: 'Champions student amenities, health, and campus well-being' },
    ];
  }
}

export async function createPositionApi(data: {
  title: string;
  department?: string;
  description?: string;
  maxSelections?: number;
}): Promise<PositionItem> {
  const res = await fetch('/api/positions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create position');
  }
  const result = await res.json();
  return result.position;
}

export async function deletePositionApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/positions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete position');
  }
  const result = await res.json();
  return result.success;
}

