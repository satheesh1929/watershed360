import { NextRequest, NextResponse } from 'next/server';
import { callGeminiText } from '@/lib/gemini';
import { getWatershedContext } from '@/lib/watershed-data';

export async function POST(request: NextRequest) {
  try {
    const { question, history, watershedId } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'A valid question string is required.' },
        { status: 400 }
      );
    }

    const context = await getWatershedContext(watershedId);

    const systemInstruction = `You are the WATERSHED360 AI Copilot — an expert geospatial intelligence advisor for watershed planning, geo-coded image interpretation, and impact verification under WDC-PMKSY 2.0.

Key Operating Rules:
1. Grounding & Honesty: Answer using the supplied catchment dataset for ${context.metadata.name} (${context.metadata.code}, ${context.metadata.district}). Cite specific intervention codes (e.g. CD-01, PT-01, CCT-01), coordinates, observation dates, and well recoveries where applicable. Do not invent measurements, unverified budgets, or fictional outcomes.
2. Scientific Transparency: WATERSHED360 is an analytical layer integrating Sentinel-2 Level-2A (10m BOA), Copernicus GLO-30 DEM, and government in-situ dug-well telemetry. Explain that NDVI is an indicator of green canopy biomass/vigor and not direct proof of deep aquifer recharge without well soundings.
3. Clarity: Structure responses with clean markdown (bullet points, bold highlights, concise metrics, limitations).
4. Insufficient Data: If the user asks about an unmonitored parameter or region outside the active catchment, state honestly that field telemetry is not yet ingested for that feature.
5. Technical Depth: Fluently handle Strahler stream orders (1-4), Sentinel-2 NDVI/NDWI reflectance, RUSLE soil erosion factors (R, K, LS, C, P), MCDA sensitivity scoring, open dug-well recoveries, and civil siltation audits.`;

    const userPrompt = `WATERSHED GROUNDED CONTEXT:
${JSON.stringify(context, null, 2)}

${history && Array.isArray(history) && history.length > 0 ? `PREVIOUS CONVERSATION:
${history.map((m: any) => `${m.role === 'user' ? 'USER' : 'COPILOT'}: ${m.text}`).join('\n')}
` : ''}

USER QUESTION:
${question}`;

    const answer = await callGeminiText(userPrompt, systemInstruction);

    return NextResponse.json({
      answer,
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Copilot API route error:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to process Copilot request.',
        details: 'Check that GEMINI_API_KEY is configured on the server.'
      },
      { status: 500 }
    );
  }
}
