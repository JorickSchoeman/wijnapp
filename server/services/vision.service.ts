import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GOOGLE_VISION_API_KEY;
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export class VisionService {
  /**
   * Performs OCR on a base64 encoded image using Google Cloud Vision API
   */
  async performOCR(base64Image: string): Promise<string> {
    if (!API_KEY) {
      console.warn('⚠️ Google Vision API Key missing. Falling back to simulation.');
      return "Chateau Margaux Bordeaux 2017"; 
    }

    // Strip header if present (data:image/jpeg;base64,...)
    const content = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    try {
      const response = await fetch(VISION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }),
      });

      const data = await response.json();
      const textAnnotation = data.responses?.[0]?.fullTextAnnotation?.text;

      if (!textAnnotation) {
        console.warn('No text detected in image.');
        return "";
      }

      return textAnnotation.replace(/\n/g, ' ').trim();
    } catch (error) {
      console.error('Vision API Error:', error);
      throw new Error('Failed to analyze image with Google Vision.');
    }
  }
}

export const visionService = new VisionService();
