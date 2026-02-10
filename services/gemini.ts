
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, CourseModule, SimulationFeedback, Message } from "../types.ts";

/**
 * Helper to get a fresh AI instance
 */
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMedicalQuiz = async (
  topic: string, 
  count: number = 5, 
  difficulty: string = 'Medium', 
  type: string = 'Multiple Choice',
  model: string = 'gemini-3-flash-preview',
  context?: string,
  restrictToContext: boolean = false
): Promise<QuizQuestion[]> => {
  const ai = getAi();
  
  let promptTypeInstruction = '';
  if (type === 'Open Ended') {
    promptTypeInstruction = 'Generate open-ended clinical reasoning questions.';
  } else if (type === 'Multiple Choice') {
    promptTypeInstruction = 'Generate multiple choice questions with exactly 4 options.';
  } else {
    promptTypeInstruction = 'Generate a mix of multiple choice questions (with 4 options) and open-ended clinical reasoning questions.';
  }

  const contextInstruction = context 
    ? `${restrictToContext ? 'STRICTLY' : ''} Use the following clinical reference material as the source: ${context}. ${!restrictToContext ? 'You may supplement with current medical guidelines if necessary.' : ''}`
    : `Focus topic: ${topic}.`;

  const prompt = `Generate ${count} medical questions. 
       Difficulty level: ${difficulty}. 
       ${promptTypeInstruction}
       ${contextInstruction}
       For each question, provide a detailed clinical rationale and a scientific reference.
       If the question is open-ended, leave the options array empty and set correctAnswer to 0.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of correct option, use 0 if open ended" },
            explanation: { type: Type.STRING },
            reference: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation", "reference"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const generateQuizOutline = async (context: string): Promise<string[]> => {
  const ai = getAi();
  const prompt = `Analyze the following medical content and provide a list of 5-8 key clinical topics or themes that could be used to generate assessment questions:
  
  Content: ${context.substring(0, 5000)}
  
  Return the list as a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const generateClinicalCase = async (
  specialty: string, 
  examType: string = 'OSCE', 
  customPrompt: string = '', 
  model: string = 'gemini-3-flash-preview'
): Promise<any> => {
  const ai = getAi();
  const prompt = `Generate a realistic clinical case for an ${examType} examination. 
  Focus Specialty: ${specialty}.
  Custom Requirements/Scenario: ${customPrompt || 'Standard high-fidelity clinical case.'}
  
  Include a detailed rubric for assessment, the model answer, and a clinical reference/guideline source.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patientName: { type: Type.STRING },
          age: { type: Type.INTEGER },
          gender: { type: Type.STRING },
          presentingComplaint: { type: Type.STRING },
          medicalHistory: { type: Type.STRING },
          hiddenDiagnosis: { type: Type.STRING },
          vitals: {
            type: Type.OBJECT,
            properties: {
              bp: { type: Type.STRING },
              hr: { type: Type.INTEGER },
              temp: { type: Type.STRING }
            }
          },
          rubric: { type: Type.ARRAY, items: { type: Type.STRING } },
          modelAnswer: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING },
              management: { type: Type.STRING },
              investigations: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          reference: { type: Type.STRING }
        },
        required: ["patientName", "age", "gender", "presentingComplaint", "medicalHistory", "vitals", "hiddenDiagnosis", "rubric", "modelAnswer", "reference"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const generateCourseOutline = async (topic: string, courseType: string): Promise<CourseModule[]> => {
  const ai = getAi();
  const prompt = `Create a medical course blueprint for: ${topic}. 
  Course Primary Format: ${courseType}. 
  Suggest exactly 5 modules. The allowed module types are 'audio', 'video', 'slides', 'hybrid', 'lesson'. 
  Each module needs an ID, type, title, reference (standard guideline), and a brief clinical description.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, description: "Must be 'audio', 'video', 'slides', 'hybrid', or 'lesson'" },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            reference: { type: Type.STRING }
          },
          required: ["id", "type", "title", "description", "reference"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const generateModuleDetail = async (topic: string, moduleTitle: string, type: string): Promise<any> => {
  const ai = getAi();
  const prompt = `Generate medical educational content for "${moduleTitle}" in "${topic}". 
  Module type: ${type}. 
  - If 'lesson' or 'audio': Provide a 500-word lecture script.
  - If 'video': Provide a video script and scene descriptions.
  - If 'slides': Provide 5 medical slide titles and bullet points.
  - If 'hybrid': Provide a clinical brief for a virtual lab interaction.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          slides: { type: Type.ARRAY, items: { type: Type.STRING } },
          data: { type: Type.STRING, description: "Additional medical context for labs or scripts" }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const chatWithPatient = async (history: any[], userInput: string, caseContext: string) => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history,
      { role: 'user', parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction: `You are a medical patient in a simulated clinical encounter. Act realistically according to this case data: ${caseContext}. Stay in character. Do not reveal you are an AI. Respond briefly and naturally.`,
    }
  });

  return response.text;
};

export const generateSimulationFeedback = async (
  messages: Message[],
  caseContext: string
): Promise<SimulationFeedback> => {
  const ai = getAi();
  const prompt = `Evaluate the following medical simulation encounter transcript based on the provided case context.
  
  Case Context: ${caseContext}
  
  Transcript:
  ${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
  
  Provide a detailed evaluation in JSON format including:
  1. Overall score (0-100).
  2. List of strengths.
  3. List of areas for improvement.
  4. Rubric scores (criterion name, score, max).
  5. A concise "clinical key" pearl for learning.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          rubricScores: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                criterion: { type: Type.STRING },
                score: { type: Type.NUMBER },
                max: { type: Type.NUMBER }
              },
              required: ["criterion", "score", "max"]
            }
          },
          clinicalKey: { type: Type.STRING }
        },
        required: ["score", "strengths", "improvements", "rubricScores", "clinicalKey"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};