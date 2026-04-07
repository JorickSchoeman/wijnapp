import { Wine } from '@prisma/client';
import { normalize, canonicalGrapes, canonicalRegion } from './normalize.js';
import { prisma } from '../lib/prisma.js';

export class IngestionService {
  /**
   * Normalizes raw hamersma entry into a Wine record
   */
  async processHamersmaEntry(entry: any): Promise<Wine> {
    const canonicalName = normalize(entry.name);
    const canonicalProducer = normalize(entry.winery || entry.producer);
    const region = canonicalRegion(entry.region);
    const grapes = canonicalGrapes(entry.grape);

    const wine = await prisma.wine.create({
      data: {
        name: entry.name,
        winery: entry.winery || entry.producer,
        grape: entry.grape,
        region: entry.region,
        type: entry.type,
        year: entry.year,
        price: entry.price,
        store: entry.store,
        score: entry.score || entry.hamersma,
        description: entry.description,
        url: entry.url,
        canonicalName,
        canonicalProducer,
        canonicalRegion: region,
        canonicalGrapes: grapes,
        source: 'De Grote Hamersma',
      }
    });

    return wine;
  }

  /**
   * Ingest initial data (Seed) for De Grote Hamersma
   */
  async seedInitialData() {
    const hamersmaData = [
      { name: 'Catena Malbec', winery: 'Catena Zapata', type: 'Rood', grape: 'Malbec', region: 'Mendoza, Argentinië', store: 'Gall & Gall', year: '2021', score: '9' },
      { name: 'Celeste Crianza', winery: 'Torres', type: 'Rood', grape: 'Tempranillo', region: 'Ribera del Duero', store: 'Gall & Gall', year: '2020', score: '8.5+' },
      { name: 'Yealands Sauvignon Blanc', winery: 'Yealands', type: 'Wit', grape: 'Sauvignon Blanc', region: 'Marlborough', store: 'Gall & Gall', year: '2023', score: '8.5' },
      { name: 'AIX Rose', winery: 'Maison Saint Aix', type: 'Rosé', grape: 'Grenache Blend', region: 'Provence', store: 'Gall & Gall', year: '2023', score: '8-' },
      { name: 'Moët & Chandon Brut', winery: 'LVMH', type: 'Mousserend', grape: 'Champagne Blend', region: 'Champagne', store: 'Gall & Gall', year: 'NV', score: '8.5' },
      { name: 'AH Excellent Chablis', winery: 'AH Selectie', type: 'Wit', grape: 'Chardonnay', region: 'Bourgogne', store: 'Albert Heijn', year: '2022', score: '9' },
      { name: 'Cono Sur Bicicleta', winery: 'Cono Sur', type: 'Wit', grape: 'Viognier', region: 'Central Valley', store: 'Albert Heijn', year: '2023', score: '7.5' },
      { name: 'Lindeman\'s Bin 65', winery: 'Lindeman\'s', type: 'Wit', grape: 'Chardonnay', region: 'South Eastern Australia', store: 'Albert Heijn', year: '2023', score: '7' },
      { name: 'Hardys Nottage Hill', winery: 'Hardys', type: 'Rood', grape: 'Shiraz', region: 'South Eastern Australia', store: 'Albert Heijn', year: '2022', score: '7.5' },
      { name: 'Casillero del Diablo', winery: 'Concha y Toro', type: 'Rood', grape: 'Cabernet Sauvignon', region: 'Central Valley', store: 'Jumbo', year: '2022', score: '8-' },
      { name: 'Villa Maria Private Bin', winery: 'Villa Maria', type: 'Wit', grape: 'Sauvignon Blanc', region: 'Marlborough', store: 'Jumbo', year: '2023', score: '8.5' },
      { name: 'The Butcher Guy', winery: 'Schwarz', type: 'Rood', grape: 'Zweigelt', region: 'Burgenland', store: 'Gall & Gall', year: '2021', score: '8.5' },
      { name: 'Grüner Veltliner Kamptal', winery: 'Bründlmayer', type: 'Wit', grape: 'Grüner Veltliner', region: 'Niederösterreich', store: 'Gall & Gall', year: '2022', score: '9-' },
      { name: 'Primitivo di Manduria', winery: 'Sessantanni', type: 'Rood', grape: 'Primitivo', region: 'Puglia', store: 'De Grote Hamersma', year: '2019', score: '9' },
      { name: 'Cloudy Bay', winery: 'LVMH', type: 'Wit', grape: 'Sauvignon Blanc', region: 'Marlborough', store: 'Gall & Gall', year: '2023', score: '9+' },
      { name: 'Château Margaux', winery: 'Margaux', type: 'Rood', grape: 'Cabernet Sauvignon', region: 'Bordeaux, Frankrijk', store: 'Gall & Gall', year: '2017', score: '10-' },
      { name: 'Tignanello', winery: 'Antinori', type: 'Rood', grape: 'Sangiovese Blend', region: 'Toscane, Italië', store: 'Gall & Gall', year: '2020', score: '9+' },
    ];

    console.log('Ingesting initially seeded Hamersma data...');
    for (const entry of hamersmaData) {
      await this.processHamersmaEntry(entry);
    }
    console.log('Seeding complete.');
  }
}

export const ingestionService = new IngestionService();
