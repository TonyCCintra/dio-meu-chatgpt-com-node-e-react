// server.js
require('dotenv').config(); // Carrega variáveis de ambiente do .env no início de tudo
const express = require('express');
const { OpenAI } = require('openai'); // Importa a classe OpenAI
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; // Usa a porta do .env ou 3001 como padrão

// --- Configuração do OpenAI ---
// Verifica se a chave da API foi carregada corretamente
// Mesmo com o mock, é bom manter essa verificação para quando o mock for removido.
if (!process.env.OPENAI_API_KEY) {
    console.error("AVISO: A variável de ambiente OPENAI_API_KEY não está definida.");
    console.warn("O aplicativo continuará em MODO MOCK devido à ausência da chave OpenAI.");
    // Não vamos encerrar o processo (process.exit(1)) para permitir o modo mock.
}

// Inicializa o cliente OpenAI, mesmo que não seja usado no modo mock.
// Isso evita erros se esquecermos de descomentar quando o mock for removido.
let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}


// --- Middlewares ---
app.use(cors()); // Habilita CORS para todas as rotas (permite que seu frontend se comunique com este backend)
app.use(express.json()); // Habilita o Express para entender requisições com corpo no formato JSON

// --- Rotas ---

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
    res.send('Servidor do Clone ChatGPT (Backend) está rodando!');
});

// Rota principal para interagir com o chat
app.post('/api/chat', async (req, res) => {
    try {
        // Pega a 'message' (mensagem do usuário) e 'history' (histórico da conversa) do corpo da requisição
        const { message, history = [] } = req.body;

        if (!message) {
            // Se não houver mensagem, retorna um erro 400 (Bad Request)
            return res.status(400).json({ error: 'A propriedade "message" é obrigatória no corpo da requisição.' });
        }

        // --- INÍCIO DO MOCK - REMOVER QUANDO O PROBLEMA DA API FOR RESOLVIDO ---
        // Para desativar o mock, comente ou remova as 3 linhas abaixo.
        console.log("MODO MOCK ATIVADO - SIMULANDO RESPOSTA DA IA para a mensagem:", message);
        const mockReply = `Esta é uma resposta simulada do backend para sua pergunta: "${message}" (Histórico recebido: ${history.length} mensagens)`;
        return res.json({ reply: mockReply });
        // --- FIM DO MOCK ---

        // O CÓDIGO ABAIXO SÓ SERÁ EXECUTADO SE O MOCK ACIMA FOR REMOVIDO/COMENTADO
        // E SE A CHAVE OPENAI_API_KEY ESTIVER CONFIGURADA

        if (!openai) {
            console.error("Erro: Cliente OpenAI não inicializado. Verifique a OPENAI_API_KEY.");
            return res.status(500).json({ error: "Configuração da API da OpenAI ausente no servidor." });
        }

        // Monta o array de mensagens para enviar à API da OpenAI
        const messagesForAPI = [
            { role: "system", content: "Você é um assistente prestativo e conciso." },
            ...history,
            { role: "user", content: message }
        ];

        console.log("Enviando para OpenAI (REAL):", JSON.stringify(messagesForAPI, null, 2));

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messagesForAPI,
        });

        const assistantResponse = completion.choices[0].message.content;
        console.log("Resposta da OpenAI (REAL):", assistantResponse);

        res.json({ reply: assistantResponse });

    } catch (error) {
        console.error('Erro na rota /api/chat:');
        if (error.response) {
            console.error('Status do erro da API OpenAI:', error.response.status);
            console.error('Dados do erro da API OpenAI:', error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error('Mensagem de erro interna:', error.message);
            // Adicionando o stack trace para melhor depuração de erros internos
            console.error('Stack trace:', error.stack);
            res.status(500).json({ error: 'Ocorreu um erro interno no servidor ao processar sua solicitação.' });
        }
    }
});

// --- Iniciar o Servidor ---
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
    if (process.env.OPENAI_API_KEY) {
        console.log("API Key da OpenAI detectada. O modo real será usado se o mock for desativado.");
    } else {
        console.warn("API Key da OpenAI NÃO detectada. O aplicativo funcionará em MODO MOCK.");
    }
    console.log(`Para testar a rota principal, envie uma requisição POST para http://localhost:${port}/api/chat`);
    console.log(`com um corpo JSON como: { "message": "Sua pergunta aqui" }`);
});