
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generatePostText = async (niche: string, tone: string, audience: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Crie uma legenda engajadora para uma postagem nas redes sociais.
  Nicho: ${niche}
  Tom de voz: ${tone}
  Público-alvo: ${audience}
  Inclua hashtags relevantes e emojis. Mantenha o texto curto e impactante.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.8,
      topP: 0.95,
    },
  });

  return response.text || "Erro ao gerar texto.";
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  const imagePrompt = `Uma imagem profissional, moderna e minimalista para redes sociais sobre: ${prompt}. Estilo fotográfico de alta qualidade.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: imagePrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  let imageUrl = '';
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return imageUrl;
};
