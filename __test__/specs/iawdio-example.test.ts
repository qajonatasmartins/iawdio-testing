import { iawdio } from '../../src/agent/iawdio'

describe('Fluxo com iawdio', () => {

    it('deve executar os comandos a partir do prompt em português', async () => {
        const username = `android=new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/textInputEditText").text("Usuário")`
        const password = `android=new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/textInputEditText").text("Senha")`
        const employeeRequired = `android=new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/userNameZOI").childSelector(new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/textinput_error"))`
        const passwordRequired = `android=new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/passwordZOI").childSelector(new UiSelector().resourceId("${process.env.APP_PACKAGE}:id/textinput_error"))`

        await iawdio("No campo 'Usuário' limpe o valor do campo", { timeoutMsg: "O campo de usuário não foi encontrado", element: username })

        await iawdio("No campo 'Senha' limpe o valor do campo", { timeoutMsg: "O campo de senha não foi encontrado", element: password })

        await iawdio("Deve exibir uma mensagem exatamente igual a 'Preencha seu e-mail ou CPF' abaixo do campo 'Usuário'", { timeoutMsg: "O campo de usuário não foi encontrado", element: employeeRequired })
        await iawdio("Deve exibir uma mensagem exatamente igual a 'Preencha sua senha' abaixo do campo 'Senha'", { timeoutMsg: "O campo de senha não foi encontrado", element: passwordRequired })
    })
})
