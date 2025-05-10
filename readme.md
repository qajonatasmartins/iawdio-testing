# IAWDIO Testing

Uma biblioteca para automação de testes mobile usando WebdriverIO com capacidades de IA.

## Instalação

```bash
npm install iawdio-testing
# ou
yarn add iawdio-testing
# ou
pnpm add iawdio-testing
```

## Requisitos

- Node.js 16 ou superior
- WebdriverIO 9.x
- Appium 2.x
- Uma chave de API da OpenAI

## Configuração

1. Primeiro, configure suas credenciais da OpenAI:

```typescript
import { setupIATesting } from 'iawdio-testing';

await setupIATesting({
  openaiApiKey: 'sua-chave-api-aqui',
  model: 'gpt-4', // opcional
  temperature: 0.7 // opcional
});
```

2. Configure seu teste mobile:

```typescript
import { runAITest } from 'iawdio-testing';

const testConfig = {
  deviceName: 'Pixel_4',
  platformName: 'Android',
  automationName: 'UiAutomator2',
  appPackage: 'com.example.app',
  appActivity: 'com.example.app.MainActivity'
};

await runAITest(testConfig, 'Faça login no aplicativo usando as credenciais de teste');
```

## Exemplos de Uso

### Teste Básico

```typescript
import { runAITest } from 'iawdio-testing';

const testConfig = {
  deviceName: 'iPhone_12',
  platformName: 'iOS',
  automationName: 'XCUITest',
  app: '/caminho/para/seu/app.app'
};

await runAITest(testConfig, 'Navegue até a tela de perfil e verifique se o nome do usuário está correto');
```

### Teste com Configurações Personalizadas

```typescript
import { runAITest, IAConfig } from 'iawdio-testing';

const iaConfig: IAConfig = {
  openaiApiKey: 'sua-chave-api-aqui',
  model: 'gpt-4',
  temperature: 0.5
};

await setupIATesting(iaConfig);
```

## Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso guia de contribuição antes de enviar um pull request.

## Licença

ISC
