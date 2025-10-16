import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSmile, FaTimes } from 'react-icons/fa';

const EMOJIS = ['😀', '😂', '😎', '🤔', '😢', '😡', '👍', '👎', '🔥', '💯', '🎉', '👏', '🤝', '💪', '🙏', '❤️', '⚡', '✨', '🎯', '♟️', '👑', '🏆'];

function GameChat({ socket, gameId, playerUsername, opponentUsername }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('chatMessage', (data) => {
      setMessages(prev => [...prev, {
        username: data.username,
        message: data.message,
        timestamp: new Date(data.timestamp),
        isOwn: data.username === playerUsername
      }]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [socket, playerUsername]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !socket || !gameId) return;

    socket.emit('sendChatMessage', {
      gameId,
      message: inputMessage.trim()
    });

    setInputMessage('');
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (isMinimized) {
    return (
      <div className="game-chat minimized" onClick={() => setIsMinimized(false)}>
        <div className="chat-minimized-header">
          <FaSmile /> Chat
          {messages.length > 0 && <span className="message-count">{messages.length}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="game-chat" ref={chatContainerRef}>
      <div className="chat-header">
        <div className="chat-title">
          <FaSmile /> Chat
        </div>
        <button className="minimize-btn" onClick={() => setIsMinimized(true)}>
          <FaTimes />
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Say hi to {opponentUsername}! 👋</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.isOwn ? 'own' : 'opponent'}`}>
              <div className="message-header">
                <span className="message-username">{msg.username}</span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-content">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {showEmojiPicker && (
        <div className="emoji-picker">
          <div className="emoji-grid">
            {EMOJIS.map((emoji, index) => (
              <button
                key={index}
                className="emoji-btn"
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="chat-input-form" onSubmit={sendMessage}>
        <button
          type="button"
          className="emoji-toggle-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile />
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          maxLength={200}
        />
        <button type="submit" className="send-btn" disabled={!inputMessage.trim()}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default GameChat;