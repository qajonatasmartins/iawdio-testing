// agent/appium.helper.ts
import { remote } from 'webdriverio';

export const getPageXML = async (): Promise<string> => {
    try {
        const driver = await remote({
            capabilities: {
                platformName: 'Android',
                'appium:automationName': 'UiAutomator2'
            }
        });

        const xml = await driver.getPageSource();
        await driver.deleteSession();

        return xml;
    } catch (error) {
        console.error('Erro ao obter XML da página:', error);
        throw error;
    }
};
