import { expect } from '@wdio/globals';
import { OpenAI } from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Variável de ambiente OPENAI_API_KEY é necessária');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Gera um comando TypeScript a partir de um prompt, XML e elemento.
 * @param prompt - O prompt fornecido pelo usuário.
 * @param xml - O XML da tela atual.
 * @param timeoutMsg - A mensagem de timeout.
 * @param element - O elemento a ser utilizado.
 * @returns O comando TypeScript gerado.
 */
export async function parseAndGenerateCommand(prompt: string, xml: string, timeoutMsg?: string, element?: string): Promise<string> {
  const fullPrompt = element
    ? `📌 O mapeamento fornecido já contém o seletor WebdriverIO válido para o elemento desejado.
          Portanto, não leia o XML. Apenas utilize diretamente o seletor.
          Exemplo:
            await $('${element}').waitForDisplayed({ timeoutMsg: ${timeoutMsg} });
            await $('${element}').setValue("valor"); // ou .click(), .getText(), etc

    🛑 Regras obrigatórias:
    - Sempre aguarde o elemento com waitForDisplayed
    - Sempre valide a ação executada. Exemplo para setValue:
      const valor = await $('${element}').getText();
      expect(valor).toHaveText('valor informado')
    - Se o elemento não existir ou a validação falhar, o teste deve falhar imediatamente.
    - Use assertivas com expect-webdriverio.

    📌 Comando do usuário:${prompt}`
    : `Você é um assistente de automação de testes mobile com Appium + WebdriverIO usando TypeScript.

    Seu objetivo é interpretar comandos em português e gerar **comandos robustos e seguros de automação mobile**, baseando-se no XML da tela e no contexto fornecido.

---

📦 Tecnologias utilizadas:
- WebdriverIO com TypeScript
- Appium para Android
- expect-webdriverio (https://webdriver.io/docs/api/expect-webdriverio)

---

📚 Interpretação do comando:

1. **Preenchimento de campo (input)**  
   Se o prompt contiver “no campo”, “informe o valor”, “digite” → ação 'setValue'.
2. **Clique em botão**  
   Se o prompt contiver “clique”, “pressione”, “toque” → ação 'click'.

3. **Validação de mensagem/texto**  
   Se contiver “verifique”, “mensagem”, “texto”:
   - use 'getText()' seguido de:
     - expect-webdriverio: 'expect($('${element}')).toHaveText(...)'

---

📚 Mapeamento DE → PARA (componentes comuns):

| XML/class ou atributo                 | Interpretação                       |
|--------------------------------------|-------------------------------------|
| EditText, TextInputEditText          | Campo de texto                      |
| View com focusable=true              | Campo Compose                       |
| Button, ImageButton, TextView clicável | Botão                             |
| TextView sem clique                  | Label ou mensagem                   |

---

📌 Hierarquia de seletores (prioridade):

1. Accessibility ID → \`$('~valor')\`  (content-desc)
2. resource-id → \`$('android=new UiSelector().resourceId("...")')\`
3. text → \`$('android=new UiSelector().text("...")')\`
4. XPath profissional:
   - contains(@text, ...)
   - following-sibling
   - preceding-sibling
   - normalize-space()
   - ../ para subir na hierarquia

---

📌 Tratamento de campos duplicados:
- Nunca use o mesmo seletor para elementos diferentes.
- Diferencie por:
  - .text("Usuário"), .text("Senha")
  - .instance(n)
  - XPath com contexto ('following-sibling::', etc)

---

📌 Scroll:
Se o elemento não estiver visível, use scroll automaticamente:

await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Texto visível")');

---

📌 Toast/mensagens transitórias:
const toastText = await $('//android.widget.Toast').getText();
expect(toastText).toHaveText("mensagem");

---

🛑 Regras obrigatórias:

- Sempre aguarde o elemento com:
  await $('${element}').waitForDisplayed({ timeoutMsg: ${timeoutMsg} });

- Sempre valide a ação (ex: após setValue, faça getAttribute('text'))

- Se a validação ou localização falhar, o teste deve falhar imediatamente.

---

📌 XML da tela: ${xml}

📌 Comando do usuário: ${prompt}

💡 Gere apenas o código TypeScript necessário com os seletores e validações. **Sem explicações ou comentários**.
`;


  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'user', content: fullPrompt }],
    temperature: 0.2
  })

  return completion.choices[0].message.content?.trim() ?? ''
}