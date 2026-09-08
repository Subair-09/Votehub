import express from 'express';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  getDbStatus,
  getAllCandidates,
  addCandidate,
  updateCandidate,
  recordVote,
  getVotesByVoter,
  getSignupCodes,
  generateSignupCodes,
  assignSignupCode,
  revokeSignupCode,
  getActivityLogs,
  getAllPositions,
  addPosition,
  deletePosition,
} from './server/db';
import { uploadMedia, getCloudinaryStatus } from './server/cloudinary';

// Load environment variables
dotenv.config();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Health & Integration Status (MongoDB + Cloudinary)
  app.get('/api/status', async (req, res) => {
    try {
      const dbStatus = await getDbStatus();
      const cloudinaryStatus = getCloudinaryStatus();
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: dbStatus,
        cloudinary: cloudinaryStatus,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch status' });
    }
  });

  // 2. Candidates API
  app.get('/api/candidates', async (req, res) => {
    try {
      const candidates = await getAllCandidates();
      res.json({ success: true, candidates });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch candidates' });
    }
  });

  app.post('/api/candidates', async (req, res) => {
    try {
      const { name, party, position, description, image, manifesto, education, experience } = req.body;
      if (!name || !position) {
        return res.status(400).json({ error: 'Name and Position are required fields.' });
      }
      const newCandidate = await addCandidate({
        id: `cand-${Date.now()}`,
        name,
        party: party || 'Independent',
        position,
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        manifesto: Array.isArray(manifesto) ? manifesto : manifesto ? [manifesto] : [],
        education: education || '',
        experience: experience || '',
      });
      res.status(201).json({ success: true, candidate: newCandidate });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create candidate' });
    }
  });

  app.put('/api/candidates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await updateCandidate(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json({ success: true, candidate: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update candidate' });
    }
  });

  // 3. Voting API (Per-Position Multi-Office Ballot)
  app.post('/api/vote', async (req, res) => {
    try {
      const { candidateId, voterId, voterName } = req.body;
      if (!candidateId || !voterId) {
        return res.status(400).json({ error: 'Candidate ID and Voter ID are required to cast a vote.' });
      }
      const result = await recordVote(candidateId, voterId, voterName);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to record vote' });
    }
  });

  app.get('/api/votes/user/:voterId', async (req, res) => {
    try {
      const { voterId } = req.params;
      const votes = await getVotesByVoter(voterId);
      res.json({ success: true, votes });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to retrieve voter votes' });
    }
  });

  // 4. Signup Codes API (7-digit code generator)
  app.get('/api/codes', async (req, res) => {
    try {
      const codes = await getSignupCodes();
      res.json({ success: true, codes });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to retrieve codes' });
    }
  });

  app.post('/api/codes/generate', async (req, res) => {
    try {
      const count = parseInt(req.body.count || '5', 10);
      const generated = await generateSignupCodes(Math.min(Math.max(count, 1), 20));
      res.status(201).json({ success: true, codes: generated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate codes' });
    }
  });

  app.post('/api/codes/assign', async (req, res) => {
    try {
      const { id, assignedTo, department } = req.body;
      if (!id || !assignedTo) {
        return res.status(400).json({ error: 'Code ID and assigned student name are required.' });
      }
      const updated = await assignSignupCode(id, assignedTo, department || 'General Studies');
      res.json({ success: true, code: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to assign code' });
    }
  });

  app.post('/api/codes/revoke', async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Code ID is required.' });
      }
      const updated = await revokeSignupCode(id);
      res.json({ success: true, code: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to revoke code' });
    }
  });

  // 5. Cloudinary Media Storage Upload API
  app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided in upload request.' });
      }

      const folder = req.body.folder || 'votehub/candidates';
      const filename = req.file.originalname || `upload_${Date.now()}`;

      console.log(`[Upload] Processing media upload: ${filename} (${req.file.size} bytes)`);
      const result = await uploadMedia(req.file.buffer, folder, filename);

      res.json({
        success: true,
        url: result.secure_url || result.url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        provider: result.provider,
      });
    } catch (err: any) {
      console.error('[Upload Error]', err);
      res.status(500).json({ error: err.message || 'Media upload failed' });
    }
  });

  // 6. Positions Management API (Admin entered & controlled)
  app.get('/api/positions', async (req, res) => {
    try {
      const positions = await getAllPositions();
      res.json({ success: true, positions });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch positions' });
    }
  });

  app.post('/api/positions', async (req, res) => {
    try {
      const { title, department, description, maxSelections } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Position title is required.' });
      }
      const position = await addPosition({
        title,
        department: department || 'General',
        description: description || '',
        maxSelections: Number(maxSelections) || 1,
      });
      res.status(201).json({ success: true, position });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create position' });
    }
  });

  app.delete('/api/positions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await deletePosition(id);
      if (!success) {
        return res.status(404).json({ error: 'Position not found' });
      }
      res.json({ success: true, message: 'Position deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete position' });
    }
  });

  // 6. Activity / Audit Logs API
  app.get('/api/activity', async (req, res) => {
    try {
      const logs = await getActivityLogs();
      res.json({ success: true, logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to get activity logs' });
    }
  });

  // ==========================================
  // Vite Middleware / Static Frontend Serving
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoteHub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
