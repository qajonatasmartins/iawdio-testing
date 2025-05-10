import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string, model?: string) => {
    openaiInstance = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
    });
    return openaiInstance;
};

export const getOpenAI = () => {
    if (!openaiInstance) {
        throw new Error('OpenAI não foi inicializado. Execute setupIATesting primeiro.');
    }
    return openaiInstance;
}; 