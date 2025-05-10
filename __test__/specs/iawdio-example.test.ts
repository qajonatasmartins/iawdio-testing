import { iawdio } from '../../src/agent/iawdio'

describe('Fluxo com iawdio', () => {

    it('deve executar os comandos a partir do prompt em português', async () => {
        const enter = `android=new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/loginZB")`
        const username = `android=new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/textInputEditText").text("Usuário")`
        const password = `android=new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/textInputEditText").text("Senha")`
        const toast = '/hierarchy/android.widget.Toast[@package="com.android.settings"]'

        await iawdio("No campo 'Usuário' informe o valor 'jonatas'", { timeoutMsg: "O campo de usuário não foi encontrado", element: username })

        await iawdio("No campo 'Senha' informe o valor '123456'", { timeoutMsg: "O campo de senha não foi encontrado", element: password })

        await iawdio("Clique no botão 'Entrar'", { timeoutMsg: "O botão de login não foi encontrado", element: enter })

        await iawdio("É esperado que seja exibida a mensagem de 'Login incorreto ou device cadastrado no local incorreto'",
            { timeoutMsg: "A mensagem de login incorreto não foi encontrada", element: toast })
    })
})
