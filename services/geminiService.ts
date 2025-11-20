import { GoogleGenAI, Type } from "@google/genai";
import { ReportData, AIAnalysisResult } from '../types';

const apiKey = process.env.API_KEY || ''; // Ensure environment variable is set

export const analyzeADR = async (data: ReportData): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Map language code to full English name for the prompt
  const languageNames: Record<string, string> = {
    th: "Thai (ภาษาไทย)",
    en: "English",
    lo: "Lao (ພາສາລາວ)",
    my: "Burmese (မြန်မာဘာသာ)"
  };

  const targetLanguage = languageNames[data.language] || "English";

  const prompt = `
    You are an expert clinical pharmacist. Analyze the following Naranjo Adverse Drug Reaction (ADR) Probability Scale assessment.
    
    IMPORTANT: Please output the "analysis" and "recommendations" values primarily in ${targetLanguage}.
    
    Patient Context:
    - Suspected Drug: ${data.drugName}
    - Reaction Description: ${data.reactionDescription}
    
    Assessment Result:
    - Naranjo Total Score: ${data.totalScore}
    - Interpretation: ${data.interpretation}
    
    Breakdown of answers:
    ${data.answers.map(a => `Q${a.questionId}: ${a.answer} (Score: ${a.score})`).join('\n')}

    Please provide a structured clinical analysis in JSON format containing:
    1. "analysis": A concise professional summary of why this score was reached and the clinical implication (In ${targetLanguage}).
    2. "recommendations": A list of 3-5 actionable steps for the healthcare provider (e.g., discontinuation, monitoring, reporting to pharmacovigilance centers) (In ${targetLanguage}).
    3. "riskFactor": Assess the risk as "Low", "Medium", or "High" based on the Naranjo score and general drug safety principles.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            riskFactor: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails
    return {
      analysis: "AI analysis temporarily unavailable. Please rely on the numerical score.",
      recommendations: ["Monitor patient vitals", "Consult standard drug references"],
      riskFactor: "Medium"
    };
  }
};