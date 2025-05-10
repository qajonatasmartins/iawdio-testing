# iawdio-testing

Projeto para execução de testes mobile com WebdriverIO com IA.

## Crie um arquivo .env na raiz do projeto

``` env
OPENAI_API_KEY=''
APK_NAME=''
APP_ACTIVITY=""
APP_PACKAGE=""
APP_VERSION=''
URL_API='http://localhost'
PORT=3030
```

## Como usar

### Crie o script

``` typescript
import { iawdio } from '../../src/agent/iawdio'

describe('Fluxo com iawdio', () => {

    it('deve executar os comandos a partir do prompt em português', async () => {
        const enter = 'android=new UiSelector().resourceId("loginZB")'
        const username = 'android=new UiSelector().resourceId("textInputEditText").text("Usuário")'
        const password = 'android=new UiSelector().resourceId("textInputEditText").text("Senha")'
        const toast = '/hierarchy/android.widget.Toast[@package="com.android.settings"]'

        await iawdio("No campo 'Usuário' informe o valor 'XPTO'", { timeoutMsg: "O campo de usuário não foi encontrado", element: username })

        await iawdio("No campo 'Senha' informe o valor '123456'", { timeoutMsg: "O campo de senha não foi encontrado", element: password })

        await iawdio("Clique no botão 'Entrar'", { timeoutMsg: "O botão de login não foi encontrado", element: enter })

        await iawdio("É esperado que seja exibida a mensagem de 'Login incorreto'",
            { timeoutMsg: "O toast não foi exibido", element: toast })
    })
})
```

### Inicie a API para integrar com openIA em uma aba do terminal

`npm run start:api`

### Execute seus testes mobile em outra aba do terminal

`npm run wdio`
