import { getOpenAI } from '../config/ia.config';

export const parseAndGenerateCommand = async (prompt: string, xml: string) => {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Você é um assistente especializado em automação mobile. 
        Analise o XML da página e gere comandos WebdriverIO baseados no prompt do usuário.
        Retorne apenas o código JavaScript válido, sem explicações adicionais.`
      },
      {
        role: "user",
        content: `XML da página:\n${xml}\n\nPrompt: ${prompt}`
      }
    ],
    temperature: 0.7,
  });

  const comando = response.choices[0]?.message?.content;
  if (!comando) {
    throw new Error('Não foi possível gerar o comando');
  }

  return comando;
};
