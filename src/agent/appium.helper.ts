// agent/appium.helper.ts

export async function getPageXML(): Promise<string> {
    //@ts-ignore
    const xml = await driver.getPageSource();
    return xml;
}