import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { matchingService } from './services/matching.service.js';
import { ingestionService } from './services/ingestion.service.js';
import { visionService } from './services/vision.service.js';
import { aiSearchService } from './services/ai-search.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

export { app };
export default app;

// Helper function to enrich wine objects with UI metadata
function enrichWine(res: any) {
  const type = (res.wine.type || '').toLowerCase();
  let emoji = '🍷';
  let bg = 'linear-gradient(135deg, #3a0010 0%, #800020 100%)';

  if (type.includes('wit')) {
    emoji = '🥂';
    bg = 'linear-gradient(135deg, #172412 0%, #2d5c0e 100%)';
  } else if (type.includes('rose') || type.includes('rosé')) {
    emoji = '🌸';
    bg = 'linear-gradient(135deg, #4a001e 0%, #9b111e 100%)';
  } else if (type.includes('mousserend') || type.includes('bubbels')) {
    emoji = '🍾';
    bg = 'linear-gradient(135deg, #0f1c11 0%, #1a3a1f 100%)';
  }

  return {
    ...res.wine,
    confidence: `${Math.round(res.score * 100)}%`,
    emoji,
    bg,
  };
}

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

app.post('/api/wine/ai-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'query is required.' });
    }

    const results = await aiSearchService.search(query);
    res.json(results.map(enrichWine));
  } catch (error) {
    console.error('AI search error:', error);
    res.status(500).json({ error: 'Internal server error during AI search.' });
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
    res.json(results.map(enrichWine));
  } catch (error) {
    console.error('Recognition error:', error);
    res.status(500).json({ error: 'Internal server error during recognition.' });
  }
});

app.post('/api/wine/sync', async (req, res) => {
  try {
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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`🚀 WineApp Backend running on port ${PORT}`);
    await initializeServer();
  });
}
