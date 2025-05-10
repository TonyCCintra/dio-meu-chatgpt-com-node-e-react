# Clone Simples do ChatGPT (Full-Stack)

Protótipo funcional de um sistema de chat inspirado no ChatGPT, implementado com uma arquitetura full-stack. O frontend foi desenvolvido utilizando React e Vite, proporcionando uma interface de usuário reativa. O backend, construído com Node.js e Express.js, gerencia as requisições e foi projetado para se comunicar com a API da OpenAI. Devido a limitações de cota (Erro 429) encontradas com a API da OpenAI durante o período de desenvolvimento, um mecanismo de mock foi implementado no servidor para simular as interações com a IA, assegurando a demonstração da funcionalidade de ponta a ponta da aplicação.

## Status Atual

*   **Frontend React:** Interface de chat básica implementada, capaz de enviar mensagens e exibir respostas.
*   **Backend Node.js:** Servidor funcional que recebe requisições do frontend.
*   **Integração OpenAI:** Atualmente, o backend está utilizando um **sistema de mock** para simular respostas da IA. Isso se due a um problema de cota (erro 429) com a API da OpenAI, mesmo com créditos aparentemente disponíveis.

## Estrutura do Projeto

O projeto está organizado com o backend na raiz e o frontend em uma subpasta:

## Tecnologias Utilizadas

*   **Frontend:**
    *   React
    *   Vite
    *   JavaScript
    *   CSS
*   **Backend:**
    *   Node.js
    *   Express.js
    *   `openai` (SDK da OpenAI - integração pendente de resolução de cota)
    *   `dotenv`
    *   `cors`

## Como Rodar o Projeto

### Pré-requisitos

*   Node.js e npm instalados (v20+ recomendado para evitar avisos `EBADENGINE` com Vite, mas v21.7.3 está funcionando com avisos).
*   Uma chave da API da OpenAI (quando o problema de cota for resolvido).

### Backend

1.  Navegue até a pasta raiz do projeto (`dio-meu-chatgpt-com-node-e-react`).
2.  Crie um arquivo `.env` na raiz, baseado no `.env.example`, e adicione sua `OPENAI_API_KEY` e `PORT` (ex: 3002).
    ```
    OPENAI_API_KEY=sua_chave_openai_aqui
    PORT=3002
    ```
3.  Instale as dependências do backend (se ainda não o fez):
    ```bash
    npm install
    ```
4.  Inicie o servidor backend:
    ```bash
    npm run dev
    ```
    O backend estará rodando em `http://localhost:3002` (ou a porta que você definiu).

### Frontend

1.  Em um novo terminal, navegue para a pasta `frontend/`:
    ```bash
    cd frontend
    ```
2.  Instale as dependências do frontend (se ainda não o fez):
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm run dev
    ```
    O frontend estará rodando em `http://localhost:5173` (ou a porta que o Vite designar, como 5174 se a 5173 estiver em uso).
4.  Abra o frontend no seu navegador. Ele se comunicará com o backend na porta 3002 (ou a porta configurada no frontend para o fetch).

## Problema Conhecido

*   **Erro 429 da API OpenAI:** A integração com a API real da OpenAI está temporariamente impedida por um erro de cota, apesar dos créditos visíveis na plataforma. O backend está configurado com um mock para permitir a demonstração do fluxo da aplicação.

## Próximos Passos (Potenciais)

*   Resolver o problema de cota da API da OpenAI e remover o mock do backend.
*   Melhorar a estilização do frontend para se assemelhar mais ao ChatGPT.
*   Implementar o envio do histórico da conversa para o backend para melhor contexto da IA.
*   Adicionar tratamento de erro mais robusto e feedback visual no frontend.