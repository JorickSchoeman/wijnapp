import { Wine } from '@prisma/client';
import Fuse from 'fuse.js';
import { normalize } from './normalize.js';
import { prisma } from '../lib/prisma.js';

// const prisma = new PrismaClient(); // Removed

export interface MatchResult {
  wine: Wine;
  score: number; // 0-1 confidence
  matchedFields: string[];
}

export class MatchingService {
  private fuse: Fuse<Wine> | null = null;

  async init() {
    const wines = await prisma.wine.findMany();
    
    this.fuse = new Fuse(wines, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'winery', weight: 0.3 },
        { name: 'canonicalName', weight: 0.5 },
        { name: 'canonicalProducer', weight: 0.4 },
        { name: 'region', weight: 0.2 },
        { name: 'grape', weight: 0.2 },
        { name: 'year', weight: 0.2 },
      ],
      includeScore: true,
      threshold: 0.6,
      distance: 100,
      shouldSort: true,
      minMatchCharLength: 2,
    });
  }

  async search(query: string): Promise<MatchResult[]> {
    if (!this.fuse) await this.init();
    
    // If query is 4 digits, try year-specific search
    const results = this.fuse!.search(query);
    
    return results.map(res => ({
      wine: res.item,
      score: 1 - (res.score || 0),
      matchedFields: res.matches?.map(m => m.key || '') || [],
    })).slice(0, 10);
  }

  async recognizeFromOCR(ocrText: string): Promise<MatchResult[]> {
    if (!this.fuse) await this.init();
    
    // Normalize OCR text
    const normalizedText = normalize(ocrText);
    const yearHint = ocrText.match(/\b(19|20)\d{2}\b/)?.[0];
    
    // Weighted search
    const results = this.fuse!.search(normalizedText);
    
    // If we have a year hint, boost results that match the year
    let mapped = results.map(res => ({
      wine: res.item,
      score: 1 - (res.score || 0),
      matchedFields: res.matches?.map(m => m.key || '') || [],
    }));

    if (yearHint) {
      mapped = mapped.map(res => {
        if (res.wine.year === yearHint) {
          return { ...res, score: Math.min(1.0, res.score + 0.1) }; // Boost by 0.1
        }
        return res;
      }).sort((a, b) => b.score - a.score);
    }
    
    return mapped.slice(0, 5);
  }

  async matchExact(name: string, winery?: string, year?: string): Promise<Wine | null> {
    const canonicalName = normalize(name);
    
    const wine = await prisma.wine.findFirst({
      where: {
        canonicalName,
        winery: winery ? { contains: winery } : undefined,
        year: year || undefined,
      }
    });

    return wine;
  }
}

export const matchingService = new MatchingService();
