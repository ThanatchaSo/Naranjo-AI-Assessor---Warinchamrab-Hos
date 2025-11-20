
import { GoogleGenAI, Type } from "@google/genai";
import { ReportData, AIAnalysisResult, AIConfig } from '../types';

// Helper to clean JSON string from Markdown code blocks or surrounding text
const cleanJsonString = (str: string): string => {
  // 1. Try to match markdown code blocks first (most reliable)
  const jsonMatch = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }

  // 2. If no markdown, try to find the valid JSON object boundaries
  // This handles cases like "Here is the JSON: { ... }"
  const firstOpen = str.indexOf('{');
  const lastClose = str.lastIndexOf('}');
  
  if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
    return str.substring(firstOpen, lastClose + 1);
  }

  // 3. Fallback: return original string
  return str;
};

export const analyzeADR = async (data: ReportData, config: AIConfig): Promise<AIAnalysisResult> => {
  const languageNames: Record<string, string> = {
    th: "Thai (ภาษาไทย)",
    en: "English",
    lo: "Lao (ພາສາລາວ)",
    my: "Burmese (မြန်မာဘာသာ)"
  };
  const targetLanguage = languageNames[data.language] || "English";

  // --- PROMPT CONSTRUCTION ---
  const promptSystem = `You are an expert clinical pharmacist. Analyze the Naranjo Adverse Drug Reaction (ADR) assessment.`;
  const promptUser = `
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
    2. "recommendations": A list of 3-5 actionable steps for the healthcare provider (e.g., discontinuation, monitoring) (In ${targetLanguage}).
    3. "riskFactor": Assess the risk as "Low", "Medium", or "High".

    IMPORTANT: Return ONLY valid JSON. Do not include markdown formatting or introductory text.
  `;

  // --- OLLAMA HANDLER ---
  if (config.provider === 'ollama') {
    try {
      const url = `${config.ollamaUrl || 'http://localhost:11434'}/api/generate`;
      
      // Setup timeout controller (60 seconds for local models)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.modelName, // e.g., 'medgemma'
          prompt: promptSystem + "\n" + promptUser,
          stream: false,
          format: "json" // Encourage JSON, but we still clean the output
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama Error (${response.status}). Ensure Ollama is running.`);
      }

      const result = await response.json();
      const cleanedJson = cleanJsonString(result.response);
      
      try {
        const parsed = JSON.parse(cleanedJson);
        return {
          analysis: parsed.analysis || "Analysis not available.",
          recommendations: parsed.recommendations || [],
          riskFactor: parsed.riskFactor || "Unknown"
        };
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw:", cleanedJson);
        throw new Error("AI response format was invalid. Please try again.");
      }
      
    } catch (error: any) {
      console.error("Ollama Error:", error);
      let msg = error.message;
      if (error.name === 'AbortError') msg = "Ollama timed out (60s). Model might be loading.";
      if (msg.includes('Failed to fetch')) msg = "Cannot connect to Ollama. Check CORS settings.";
      
      throw new Error(msg);
    }
  }

  // --- GEMINI HANDLER ---
  else {
    const apiKey = config.apiKey || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key is missing in settings.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    try {
      const response = await ai.models.generateContent({
        model: config.modelName || 'gemini-2.5-flash',
        contents: promptSystem + "\n" + promptUser,
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
      if (!text) throw new Error("No response from Gemini AI");
      
      return JSON.parse(text) as AIAnalysisResult;
    } catch (error: any) {
      console.error("Gemini Analysis Error:", error);
      throw new Error(`Gemini AI Error: ${error.message}`);
    }
  }
};
