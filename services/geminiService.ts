import { GoogleGenAI } from "@google/genai";
import { LogoStyle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateLogo(brandName: string, logoPrompt: string, style: LogoStyle): Promise<{imageUrl: string}> {
  const imageGenerationPrompt = `A professional logo for a brand named '${brandName}'.
The logo should be a visual representation of: '${logoPrompt}'.
Style: ${style.name} - ${style.description}.
The logo must be a simple, modern, vector-style icon.
It should be on a clean, solid, flat white background.
Do not include any text in the logo.
The image should show ONLY the logo itself, not presented on a business card, building sign, or any other mockup.
The design should be centered and high-quality.`;

  try {
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: imageGenerationPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0 || !imageResponse.generatedImages[0].image.imageBytes) {
      throw new Error("Image generation failed, the API did not return an image.");
    }
    const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { imageUrl };

  } catch (error) {
    console.error("Error generating logo with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during generation.");
  }
}