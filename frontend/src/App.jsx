// frontend/src/App.jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const newUserMessage = { type: 'user', text: message };
    setChatLog(prevLog => [...prevLog, newUserMessage]);
    const currentMessage = message; // Salva a mensagem antes de limpar o input
    setMessage('');
    setIsLoading(true);

    try {
      // LOG PARA VERIFICAR A MENSAGEM ENVIADA
      console.log("Frontend enviando para o backend:", currentMessage);

      // CHAMADA REAL PARA O BACKEND (Ajuste a porta se necessário)
      const response = await fetch('http://localhost:3002/api/chat', { // <<-- ATENÇÃO AQUI: PORTA 3002 (ou 3001 se você mudou)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }), // Envia a mensagem que foi digitada
      });

      if (!response.ok) {
        // Tenta pegar uma mensagem de erro do backend, se houver
        const errorData = await response.json().catch(() => ({ detail: "Erro desconhecido do servidor." }));
        throw new Error(`Erro do servidor: ${response.status} - ${errorData.detail || errorData.error || "Falha ao buscar resposta."}`);
      }

      const data = await response.json();
      const backendResponse = { type: 'assistant', text: data.reply };
      setChatLog(prevLog => [...prevLog, backendResponse]);

    } catch (error) {
      console.error("Erro ao enviar mensagem para o backend:", error);
      const errorMessage = { type: 'assistant', text: `Desculpe, ocorreu um erro: ${error.message}` };
      setChatLog(prevLog => [...prevLog, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Meu Clone ChatGPT</h1>
      </header>
      <div className="chat-window">
        <div className="chat-log">
          {chatLog.map((entry, index) => (
            <div key={index} className={`chat-message ${entry.type}`}>
              <p>{entry.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message assistant loading">
              <p>Digitando...</p>
            </div>
          )}
        </div>
      </div>
      <footer className="app-footer">
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;