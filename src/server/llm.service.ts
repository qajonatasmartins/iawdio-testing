import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BASE_PROMPT = `Você é um assistente de automação de testes mobile com Appium + WebdriverIO.
Seu objetivo é interpretar comandos escritos em português e gerar comandos TypeScript para testes automatizados.

📋 Instruções:
- Você receberá um XML que representa a tela atual do app.
- O comando será algo como: "No campo 'usuário' informe o valor 'jonatas'" ou "Clique no botão 'Entrar'".
- Se um mapeamento for fornecido, use-o diretamente ao invés de buscar o elemento no XML.
- Se não houver mapeamento, encontre no XML o elemento correspondente a esse campo ou botão.
- Para campos (input), busque elementos da classe "EditText", "TextInput", "TextField" ou similares.
- Se for um campo com um rótulo (text="usuário"), encontre o campo associado (por proximidade ou hierarquia).
- Para botões, busque por elementos com text ou content-desc igual ao texto citado no prompt e que sejam clicáveis (clickable="true").
- Utilize seletor por content-desc ou resource-id preferencialmente: $('~content-desc') ou $('android=new UiSelector().resourceId("...")').
- Ao usar XPath, utilize boas práticas (Use expressões robustas contains, following-sibling, normalize-space, preceding-sibling e etc)
- Adicione scroll automaticamente caso o elemento não esteja visível
- Sempre aguarde o elemento aparecer antes de interagir (waitForDisplayed)
- Você pode usar qualquer estilo de validação (expect, should, assert seja da biblioteca do wedriverio ou chai etc)
- Jamais reutilize o mesmo campo para comandos diferentes.
  Exemplo:
    - Como é o comportamento errado:
        [0-0] 🏃🏽 [IAWDIO] Executando o Prompt:
        [0-0] No campo 'Usuário' informe o valor 'jonatas'
        [0-0]  👨🏽‍💻 Comando gerado:
        [0-0] await $('android=new UiSelector().resourceId("com.cubostecnologia.zigpdvandroidoffline:id/textInputEditText")').setValue('jonatas');
        [0-0] 🏃🏽 [IAWDIO] Executando o Prompt:
        [0-0] No campo 'Senha' informe o valor '123456'
        [0-0]  👨🏽‍💻 Comando gerado:
        [0-0] await $('android=new UiSelector().resourceId("com.cubostecnologia.zigpdvandroidoffline:id/textInputEditText")').setValue('123456');
    - Como é o comportamento correto:
        [0-0] 🏃🏽 [IAWDIO] Executando o Prompt:
        [0-0] No campo 'Usuário' informe o valor 'jonatas'
        [0-0]  👨🏽‍💻 Comando gerado:
        [0-0] await $('android=new UiSelector().resourceId("com.cubostecnologia.zigpdvandroidoffline:id/textInputEditText").text("Usuário")').setValue('jonatas');
        [0-0] 🏃🏽 [IAWDIO] Executando o Prompt:
        [0-0] No campo 'Senha' informe o valor '123456'
        [0-0]  👨🏽‍💻 Comando gerado:
        [0-0] await $('android=new UiSelector().resourceId("com.cubostecnologia.zigpdvandroidoffline:id/textInputEditText").text("Senha")').setValue('123456');

- NÃO inclua explicações, apenas o comando.

🧾 Exemplo de saída esperada:
await $('~inputUsuario').setValue('jonatas');
ou
await $('android=new UiSelector().resourceId("com.app:id/entrar")').click();
🛑 Regras obrigatórias para quebras de teste:

- Sempre use: await el.waitForDisplayed({ timeout: 5000 });
- Se o elemento não existir ou não estiver visível, o teste deve falhar com erro.
- Nunca silencie erros de elementos não encontrados.
- Sempre valide que o campo foi preenchido corretamente após o setValue, por exemplo:
  const texto = await el.getAttribute('text');
  expect(texto).to.include('valor informado');

Se a validação não passar, o teste deve falhar.
`

export async function parseAndGenerateCommand(prompt: string, xml: string, timeoutMsg?: string, mapeamento?: string): Promise<string> {

  const fullPrompt = mapeamento
    ? `
📌 Mapeamento fornecido:
A variável "mapeamento" já contém o seletor WebdriverIO válido para o elemento desejado.
Portanto, não leia o XML. Apenas utilize diretamente o seletor. Exemplo: Aplique a ação solicitada sobre esse elemento: $('${mapeamento}').setValue("valor") ou $('${mapeamento}').click() ou $('${mapeamento}').getText()

🛑 Regras obrigatórias:
- Sempre aguarde o elemento: await $('${mapeamento}').waitForDisplayed({ timeoutMsg: ${timeoutMsg} });
- Se o elemento não existir ou o valor não estiver correto, o teste deve falhar imediatamente. Aqui você deve usar as validações da biblioteca do Chai(expect, should, assert) ou do WebdriverIO(expect).
📌 Comando do usuário:
${prompt}
`
    : `
${BASE_PROMPT}

📌 XML:
${xml}

📌 Comando do usuário:
${prompt}

🛑 Regras obrigatórias:
- Use os seletores com prioridade: Accessibility ID > resource-id > text > XPath inteligente.
- Sempre use waitForDisplayed antes da ação.
- Se não encontrar o elemento ou a validação falhar, o teste deve quebrar.
- Use asserções do Chai (expect, should, assert) e expect-webdriverio.
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'user', content: fullPrompt }],
    temperature: 0.2
  })

  return completion.choices[0].message.content?.trim() ?? ''
}