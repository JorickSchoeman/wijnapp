import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { prisma } from '../lib/prisma.js';
import { matchingService } from './matching.service.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_VISION_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export class AISearchService {
  /**
   * Searches for wines using an AI-guided semantic approach
   */
  async search(query: string) {
    if (!process.env.GOOGLE_VISION_API_KEY) {
      throw new Error('Google AI key missing.');
    }

    // Step 1: Use Gemini to translate the natural language query into search terms and filters
    const prompt = `
      Je bent een vinoloog-assistent. De gebruiker zoekt naar wijn met deze vraag: "${query}".
      Vertaal deze vraag naar een JSON object met de volgende optionele velden om in een database te zoeken:
      - grapes: string[] (bijv. ["Chardonnay", "Pinot Noir"])
      - types: string[] (bijv. ["Rood", "Wit", "Rosé"])
      - regions: string[] (bijv. ["Bourgogne", "Bordeaux"])
      - stores: string[] (bijv. ["Albert Heijn", "Jumbo"])
      - notes: string (sleutelwoorden voor smaak, bijv. "houtgerijpt", "fris", "vol")
      - maxPrice: number
      - pairing: string (het eten waar de gebruiker iets bij zoekt)

      Antwoord ALLEEN met de JSON en niets anders.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean potential markdown blocks
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const filters = JSON.parse(jsonStr);

      console.log('🤖 AI Extracted Filters:', filters);

      // Step 2: Perform a multi-factor search based on extracted filters
      // We combine several queries to find the best match
      const wines = await prisma.wine.findMany({
        where: {
          AND: [
            filters.types && filters.types.length > 0 ? { type: { in: filters.types } } : {},
            filters.stores && filters.stores.length > 0 ? { store: { in: filters.stores } } : {},
            // Use full-text simulation / contains for other fields
          ]
        },
        take: 20
      });

      // Step 3: Match results using fuzzy matching for high accuracy
      // We use the top extracted terms for the matching engine
      const searchTerms = [
        ...(filters.grapes || []),
        ...(filters.regions || []),
        filters.notes || "",
        filters.pairing || ""
      ].filter(t => t.length > 2).join(' ');

      if (searchTerms.length > 0) {
        return matchingService.search(searchTerms);
      } else if (wines.length > 0) {
          // If no specific terms found, return top results from the simple filter
          return wines.map(w => ({ wine: w, score: 0.8, matchedFields: ['ai_filter'] }));
      }

      return [];
    } catch (error) {
      console.error('AI Search Error:', error);
      // Fallback: standard fuzzy search
      return matchingService.search(query);
    }
  }
}

export const aiSearchService = new AISearchService();
