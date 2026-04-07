// Normalization utilities for wine data
// Strips accents, lowercases, removes punctuation, normalizes whitespace

export function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')     // remove punctuation
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim();
}

export function extractYear(str: string): string | null {
  const match = str.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
}

export function removeYear(str: string): string {
  return str.replace(/\b(19|20)\d{2}\b/g, '').trim();
}

export function canonicalGrapes(grapes: string): string {
  const mapping: Record<string, string> = {
    'cab sauv': 'cabernet sauvignon',
    'cab': 'cabernet sauvignon',
    'sauv blanc': 'sauvignon blanc',
    'sb': 'sauvignon blanc',
    'pinot': 'pinot noir',
    'chard': 'chardonnay',
    'temp': 'tempranillo',
    'shiraz': 'syrah',
    'gsm': 'grenache syrah mourvedre',
  };
  const normalized = normalize(grapes);
  return mapping[normalized] || normalized;
}

export function canonicalStore(store: string): string {
  const mapping: Record<string, string> = {
    'ah': 'albert heijn',
    'albert heijn': 'albert heijn',
    'appie': 'albert heijn',
    'gall': 'gall & gall',
    'gall & gall': 'gall & gall',
    'gall en gall': 'gall & gall',
    'jumbo': 'jumbo',
    'plus': 'plus',
    'lidl': 'lidl',
    'aldi': 'aldi',
    'hamersma': 'de grote hamersma',
    'de grote hamersma': 'de grote hamersma',
  };
  const normalized = normalize(store);
  return mapping[normalized] || normalized;
}

export function canonicalType(type: string): string {
  const mapping: Record<string, string> = {
    'rood': 'rood',
    'red': 'rood',
    'wit': 'wit',
    'white': 'wit',
    'rose': 'rosé',
    'rosé': 'rosé',
    'mousserend': 'mousserend',
    'sparkling': 'mousserend',
    'champagne': 'mousserend',
    'bubbels': 'mousserend',
  };
  const normalized = normalize(type);
  return mapping[normalized] || normalized;
}

export function canonicalRegion(region: string): string {
  const mapping: Record<string, string> = {
    'bordeaux': 'bordeaux',
    'bourgogne': 'bourgogne',
    'burgundy': 'bourgogne',
    'champagne': 'champagne',
    'rioja': 'rioja',
    'ribera del duero': 'ribera del duero',
    'toscane': 'toscane',
    'tuscany': 'toscane',
    'marlborough': 'marlborough',
    'mendoza': 'mendoza',
    'barossa valley': 'barossa valley',
    'napa valley': 'napa valley',
    'provence': 'provence',
    'alsace': 'alsace',
    'mosel': 'mosel',
    'puglia': 'puglia',
    'central valley': 'central valley',
  };
  const normalized = normalize(region);
  return mapping[normalized] || normalized;
}
