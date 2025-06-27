import React, { useState, useEffect } from "react";
import "./Messages.scss";
import { useUsers } from "../../hooks/useApi";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Charger les utilisateurs avec qui on peut communiquer
  const { data: users, loading: usersLoading, error: usersError } = useUsers();

  // Messages mockés pour l'instant (en attendant l'API messages)
  const mockMessages = {
    1: [
      { id: 1, sender: "current_user", content: "Salut ! J'ai vu votre projet, ça m'intéresse beaucoup.", timestamp: "2024-01-15T10:30:00Z" },
      { id: 2, sender: "other", content: "Bonjour ! Merci pour votre intérêt. Pouvez-vous me parler de votre expérience ?", timestamp: "2024-01-15T11:00:00Z" },
      { id: 3, sender: "current_user", content: "J'ai 3 ans d'expérience en React et Node.js. J'ai travaillé sur plusieurs projets similaires.", timestamp: "2024-01-15T11:15:00Z" }
    ],
    2: [
      { id: 4, sender: "other", content: "Votre candidature a été acceptée ! Félicitations !", timestamp: "2024-01-14T14:20:00Z" },
      { id: 5, sender: "current_user", content: "Merci beaucoup ! Quand pouvons-nous commencer ?", timestamp: "2024-01-14T14:25:00Z" }
    ]
  };

  useEffect(() => {
    if (selectedUser) {
      setMessages(mockMessages[selectedUser.id] || []);
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      id: Date.now(),
      sender: "current_user",
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Ici on ferait l'appel API pour envoyer le message
    // await sendMessageAPI(selectedUser.id, newMessage);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  if (usersLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Chargement des conversations...</p>
      </div>
    );
  }

  if (usersError) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>Erreur: {usersError}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <h2>Conversations</h2>
        <div className="users-list">
          {users && users.length > 0 ? (
            users.slice(0, 10).map((user) => (
              <div 
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <img 
                  src={user.profile_picture || "/img/user-default.png"} 
                  alt={user.username}
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="user-username">@{user.username}</div>
                  <div className="last-message">
                    {mockMessages[user.id] ? 
                      mockMessages[user.id][mockMessages[user.id].length - 1].content.substring(0, 50) + '...' 
                      : 'Commencer une conversation'
                    }
                  </div>
                </div>
                {mockMessages[user.id] && (
                  <div className="message-indicator">
                    <span className="message-count">{mockMessages[user.id].length}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-users">
              <p>Aucun utilisateur disponible pour la messagerie</p>
            </div>
          )}
        </div>
      </div>

      <div className="messages-main">
        {selectedUser ? (
          <>
            <div className="messages-header">
              <img 
                src={selectedUser.profile_picture || "/img/user-default.png"} 
                alt={selectedUser.username}
                className="header-avatar"
              />
              <div className="header-info">
                <h3>{selectedUser.first_name} {selectedUser.last_name}</h3>
                <p>@{selectedUser.username} • {selectedUser.city?.name || 'Ville non définie'}</p>
              </div>
            </div>

            <div className="messages-content">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>Aucun message encore. Commencez la conversation !</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((message, index) => {
                    const showDate = index === 0 || 
                      formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                    
                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="date-separator">
                            {formatDate(message.timestamp)}
                          </div>
                        )}
                        <div className={`message ${message.sender === 'current_user' ? 'sent' : 'received'}`}>
                          <div className="message-content">
                            {message.content}
                          </div>
                          <div className="message-time">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="messages-input">
              <input
                type="text"
                placeholder="Tapez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} disabled={!newMessage.trim()}>
                Envoyer
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <div className="no-conversation-content">
              <h3>Sélectionnez une conversation</h3>
              <p>Choisissez un utilisateur dans la liste pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
