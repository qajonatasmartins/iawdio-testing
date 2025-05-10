// server/index.ts
import express from 'express';
import type { RequestHandler } from 'express';
import * as dotenv from 'dotenv';
import { parseAndGenerateCommand } from './llm.service';
import { getPageXML } from '../agent/appium.helper';
import path from 'node:path';

// Carrega o arquivo .env do diretório raiz
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(express.json());

interface TestRequest {
  prompt: string;
}

const executeTest: RequestHandler = async (req, res, next) => {
  try {
    const { prompt } = req.body as TestRequest;
    if (!prompt) {
      res.status(400).json({ erro: 'Prompt ausente' });
      return;
    }

    const xml = await getPageXML();
    const comando = await parseAndGenerateCommand(prompt, xml);
    res.json({ comando });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao processar o prompt', detalhes: err });
  }
};

app.post('/executar-teste', executeTest);

app.listen(process.env.PORT, () => {
  console.log(`🚀 API rodando em ${process.env.URL_API}:${process.env.PORT}`);
});
