import { driver } from '@wdio/globals'
import { parseAndGenerateCommand } from '../server/llm.service'
import { getPageXML } from './appium.helper'

/**
 * Executa um comando de teste a partir de uma instrução em português,
 * mapeando a tela atual (XML) com apoio da IA.
 */
export async function iawdio(prompt: string, { timeoutMsg, element }: { timeoutMsg?: string, element?: string }): Promise<void> {
    const xml = await getPageXML()
    const comando = await parseAndGenerateCommand(prompt, xml, timeoutMsg, element)
    console.log(`\n🏃🏽 [IAWDIO] Executando o Prompt: \n${prompt} \n\n 👨🏽‍💻 Comando gerado: \n${comando}\n\n`)

    try {
        const executar = new Function('driver', `return (async () => { ${comando} })()`)
        await executar(driver) // `driver` já está disponível no contexto global do WebdriverIO
    } catch (err) {
        console.error(`❌ Erro ao executar comando gerado pela IA: \n\n ${err} \n\n`)
        throw err
    }
}
