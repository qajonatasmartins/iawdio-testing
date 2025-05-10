import { initializeOpenAI } from './config/ia.config';
import { parseAndGenerateCommand } from './server/llm.service';
import { getPageXML } from './agent/appium.helper';
import { remote } from 'webdriverio';

// Exporta tipos e interfaces principais
export interface IAConfig {
    openaiApiKey: string;
    model?: string;
    temperature?: number;
}

export interface TestConfig {
    deviceName: string;
    platformName: string;
    automationName: string;
    appPackage?: string;
    appActivity?: string;
    app?: string;
}

// Exporta funções utilitárias
export const setupIATesting = async (config: IAConfig) => {
    try {
        initializeOpenAI(config.openaiApiKey, config.model);
        console.log('✅ IA Testing configurado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao configurar IA Testing:', error);
        throw error;
    }
};

export const runAITest = async (testConfig: TestConfig, prompt: string) => {
    try {
        // Inicializa o driver do WebdriverIO
        const driver = await remote({
            capabilities: {
                ...testConfig,
                'appium:noReset': true
            }
        });

        // Obtém o XML da página atual
        const xml = await getPageXML();

        // Gera o comando baseado no prompt
        const comando = await parseAndGenerateCommand(prompt, xml);

        // Executa o comando gerado
        await driver.execute(comando);

        // Fecha o driver
        await driver.deleteSession();

        return { success: true, comando };
    } catch (error) {
        console.error('❌ Erro ao executar teste:', error);
        throw error;
    }
}; 