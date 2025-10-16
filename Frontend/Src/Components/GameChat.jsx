import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSmile, FaTimes } from 'react-icons/fa';

const EMOJIS = ['😀', '😂', '😎', '🤔', '😢', '😡', '👍', '👎', '🔥', '💯', '🎉', '👏', '🤝', '💪', '🙏', '❤️', '⚡', '✨', '🎯', '♟️', '👑', '🏆'];

const MAX_MESSAGES = 50; // Maximum number of messages to keep in state
const MESSAGE_TIMEOUT = 500; // Minimum time between messages in milliseconds

function GameChat({ socket, gameId, playerUsername, opponentUsername }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isWindowFocused = useRef(document.hasFocus());
  
  // Track window focus
  useEffect(() => {
    const handleFocus = () => {
      isWindowFocused.current = true;
      setUnreadCount(0);
    };
    const handleBlur = () => {
      isWindowFocused.current = false;
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const lastMessageTime = useRef(0);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (data) => {
      const now = Date.now();
      if (now - lastMessageTime.current < MESSAGE_TIMEOUT) {
        console.log('Message rate limited');
        return;
      }
      lastMessageTime.current = now;

      setMessages(prev => {
        const newMessages = [...prev, {
          username: data.username,
          message: data.message,
          timestamp: new Date(data.timestamp),
          isOwn: data.username === playerUsername,
          id: `${Date.now()}-${Math.random()}`
        }];
        // Keep only the last MAX_MESSAGES messages
        return newMessages.slice(-MAX_MESSAGES);
      });
    };

    socket.on('chatMessage', handleChatMessage);

    return () => {
      socket.off('chatMessage', handleChatMessage);
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

    const now = Date.now();
    if (now - lastMessageTime.current < MESSAGE_TIMEOUT) {
      console.log('Message sending rate limited');
      return;
    }
    lastMessageTime.current = now;

    try {
      socket.emit('sendChatMessage', {
        gameId,
        message: inputMessage.trim().slice(0, 200) // Limit message length
      });

      // Optimistically add message to state
      setMessages(prev => {
        const newMessages = [...prev, {
          username: playerUsername,
          message: inputMessage.trim(),
          timestamp: new Date(),
          isOwn: true,
          id: `${Date.now()}-${Math.random()}`
        }];
        return newMessages.slice(-MAX_MESSAGES);
      });

      setInputMessage('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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