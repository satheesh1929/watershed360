import { NextRequest, NextResponse } from 'next/server';
import { callGeminiVision } from '@/lib/gemini';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, imageUrl, mimeType = 'image/jpeg', photoMetadata } = await request.json();

    let finalBase64 = imageBase64;
    let finalMime = mimeType;

    // If a local public image path was provided (e.g. /evidence/checkdam_cd01.jpg)
    if (!finalBase64 && imageUrl) {
      if (imageUrl.startsWith('/')) {
        const localPath = path.join(process.cwd(), 'public', imageUrl);
        if (fs.existsSync(localPath)) {
          const fileBuffer = fs.readFileSync(localPath);
          finalBase64 = fileBuffer.toString('base64');
          finalMime = imageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg';
        }
      } else if (imageUrl.startsWith('http')) {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        finalBase64 = Buffer.from(arrayBuffer).toString('base64');
        finalMime = response.headers.get('content-type') || 'image/jpeg';
      }
    }

    if (!finalBase64) {
      return NextResponse.json(
        { error: 'An imageBase64 payload or valid imageUrl is required for vision analysis.' },
        { status: 400 }
      );
    }

    const systemInstruction = `You are an expert Civil & Remote Sensing Watershed Engineer evaluating geo-tagged field evidence under PMKSY-WDC 2.0.
Analyze the photograph with scientific rigor and visual honesty.

Rules:
1. Ground observation on visible elements only.
2. Note that a single 2D photograph cannot establish exact engineering load capacities or subsurface percolation without physical sounding.
3. Explicitly state evidence limitations.
4. Output your analysis in clean JSON format matching the schema requested.`;

    const prompt = `Analyze this watershed civil structure / conservation intervention photograph.
${photoMetadata ? `ADDITIONAL METADATA: ${JSON.stringify(photoMetadata)}` : ''}

Respond with a JSON object containing the following exact fields:
{
  "visibleFeatures": ["string", "string"],
  "structuralIntegrity": "Clear assessment of visible masonry, crest, abutments, and apron state",
  "siltationObservations": "Visible sediment buildup observations in the upstream impoundment zone",
  "possibleConcerns": ["string", "string"],
  "evidenceLimitations": "Clear scientific disclaimer on what cannot be definitively proven from a single photograph",
  "recommendedAction": "Concrete civil/field engineering recommendation (e.g. desilting, masonry repointing, catchment plantation)",
  "confidenceScore": 0.85
}`;

    const rawResponse = await callGeminiVision(finalBase64, finalMime, prompt, systemInstruction);

    // Extract JSON block if wrapped in markdown fences
    let parsedJson: any = null;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedJson = JSON.parse(jsonMatch[0]);
      } else {
        parsedJson = { summary: rawResponse };
      }
    } catch {
      parsedJson = { summary: rawResponse };
    }

    return NextResponse.json({
      status: 'success',
      analysis: parsedJson,
      rawText: rawResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Vision analysis error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to analyze field evidence photo.',
        details: 'Check server GEMINI_API_KEY configuration and image format.'
      },
      { status: 500 }
    );
  }
}
