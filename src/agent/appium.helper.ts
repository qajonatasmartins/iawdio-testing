export async function getPageXML(): Promise<string> {
    //@ts-ignore
    return await driver.getPageSource()
}