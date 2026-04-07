import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { matchingService } from './services/matching.service.js';
import { ingestionService } from './services/ingestion.service.js';
import { visionService } from './services/vision.service.js';

dotenv.config();

const app = express();
// const prisma = new PrismaClient(); // Removed
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Server: Seed data if database is empty
async function initializeServer() {
  const count = await prisma.wine.count();
  if (count === 0) {
    console.log('Database empty. Seeding initial Hamersma data...');
    await ingestionService.seedInitialData();
  }
  await matchingService.init();
  console.log('Matching engine initialized.');
}

// Routes
app.get('/api/wine/search', async (req, res) => {
  try {
    const { q, type, store } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query "q" is required.' });
    }

    const results = await matchingService.search(q);
    
    // Server-side filtering for type/store if provided
    let filtered = results;
    if (type) {
      filtered = filtered.filter(r => r.wine.type.toLowerCase() === (type as string).toLowerCase());
    }
    if (store) {
      filtered = filtered.filter(r => r.wine.store?.toLowerCase() === (store as string).toLowerCase());
    }

    res.json(filtered);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error during search.' });
  }
});

app.post('/api/wine/recognize', async (req, res) => {
  try {
    const { ocrText, image } = req.body;
    let textToMatch = ocrText;

    if (image) {
      console.log('🖼️  Processing image via Google Vision...');
      textToMatch = await visionService.performOCR(image);
    }

    if (!textToMatch || typeof textToMatch !== 'string') {
      return res.status(400).json({ error: 'ocrText or image is required.' });
    }

    const results = await matchingService.recognizeFromOCR(textToMatch);
    res.json(results);
  } catch (error) {
    console.error('Recognition error:', error);
    res.status(500).json({ error: 'Internal server error during recognition.' });
  }
});

app.post('/api/wine/sync', async (req, res) => {
  try {
    // Logic for triggering a new sync from De Grote Hamersma
    // Simulating call to Hamersma source ingestion
    await ingestionService.seedInitialData(); 
    await matchingService.init();
    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Internal server error during sync.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'WineApp Recognition Backend' });
});

app.listen(PORT, async () => {
  console.log(`🚀 WineApp Backend running on port ${PORT}`);
  await initializeServer();
});
