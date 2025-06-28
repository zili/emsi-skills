import React, { useState, useEffect } from "react";
import { useUsers } from "../../hooks/useApi";
import "./Messages.scss";

// Données mockées pour la démo
const mockUsers = [
  {
    id: 1,
    username: "fikri",
    first_name: "Fikri",
    last_name: "Hadwin",
    profile_picture: "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=1600",
    titreprojet: "Projet Leapdash", 
    lastMessage: "Hi Mattie! Please check out this document..."
  },
  {
    id: 2,
    username: "alice",
    first_name: "Alice",
    last_name: "Smith",
    profile_picture: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1600",
    titreprojet: "Projet Mobile App",
    lastMessage: "The design mockups are ready for review"
  },
  {
    id: 3,
    username: "warren",
    first_name: "Warren",
    last_name: "Butler",
    profile_picture: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1600",
    titreprojet: "Projet E-commerce",
    lastMessage: "Need to discuss the payment integration"
  },
  {
    id: 4,
    username: "elnora",
    first_name: "Elnora",
    last_name: "Webb",
    profile_picture: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1600",
    titreprojet: "Projet CRM System", 
    lastMessage: "Database schema has been finalized"
  },
  {
    id: 5,
    username: "jay",
    first_name: "Jay",
    last_name: "Silva",
    profile_picture: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1600",
    titreprojet: "Projet Data Analysis",
    lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  }
];

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]); // Sélectionner le premier utilisateur par défaut
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Utiliser les données mockées
  const users = mockUsers;

  // Messages mockés pour correspondre à l'image
  const mockMessages = {
    1: [
      { id: 1, sender: "other", content: "Hi Mattie! Please check out this document, related to Leapdash project as discussed yesterday. Please also prepare anything related to it, we have meeting at 13th October. Looking forward to it...", timestamp: "2024-01-15T09:41:00Z" },
      { id: 2, sender: "current_user", content: "Thanks!", timestamp: "2024-01-15T09:41:00Z" },
      { id: 3, sender: "current_user", content: "Hi Fikri, thanks for the documents, I will check it out and get back to you today!", timestamp: "2024-01-15T12:30:00Z" }
    ],
    2: [
      { id: 4, sender: "other", content: "Hello Alice! How are you doing today?", timestamp: "2024-01-14T08:20:00Z" },
      { id: 5, sender: "current_user", content: "Hi! I'm doing great, thanks for asking!", timestamp: "2024-01-14T08:25:00Z" }
    ],
    3: [
      { id: 6, sender: "other", content: "Hey Warren, are you available for a quick call?", timestamp: "2024-01-13T15:30:00Z" },
      { id: 7, sender: "current_user", content: "Sure, I'll be free in 10 minutes", timestamp: "2024-01-13T15:35:00Z" }
    ],
    4: [
      { id: 8, sender: "other", content: "Elnora, the project files are ready for review", timestamp: "2024-01-13T11:15:00Z" },
      { id: 9, sender: "current_user", content: "Perfect! I'll take a look this afternoon", timestamp: "2024-01-13T11:20:00Z" }
    ],
    5: [
      { id: 10, sender: "current_user", content: "Jay, when is our next meeting scheduled?", timestamp: "2024-01-08T14:20:00Z" },
      { id: 11, sender: "other", content: "It's scheduled for next Tuesday at 2 PM", timestamp: "2024-01-08T14:25:00Z" }
    ]
  };

  useEffect(() => {
    if (selectedUser) {
      setMessages(mockMessages[selectedUser.id] || []);
    }
  }, [selectedUser]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const sendMessage = () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

    const message = {
      id: Date.now(),
      sender: "current_user",
      content: newMessage || `📎 Fichier: ${selectedFile?.name}`,
      timestamp: new Date().toISOString(),
      file: selectedFile
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setSelectedFile(null);
  };

  const handleProjectFinish = () => {
    setShowRatingModal(true);
    setSelectedRating(0);
    setHoverRating(0);
  };

  const handleRatingSubmit = () => {
    if (selectedRating > 0) {
      // Ici vous pouvez envoyer la note à l'API
      console.log(`Projet ${selectedUser.titreprojet} terminé avec une note de ${selectedRating}/5`);
      
      // Ajouter un message automatique dans la conversation
      const message = {
        id: Date.now(),
        sender: "current_user",
        content: `✅ Projet terminé ! Note attribuée: ${selectedRating}/5 étoiles`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true
      };
      
      setMessages(prev => [...prev, message]);
      setShowRatingModal(false);
      setSelectedRating(0);
    }
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

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= (hoverRating || selectedRating) ? 'filled' : ''}`}
        onClick={() => setSelectedRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <h2>Messages</h2>
        <div className="users-list">
          {users && users.length > 0 ? (
            users.map((user) => (
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
                  <div className="last-message">
                    {user.lastMessage}
                  </div>
                </div>
                <div className="message-time-sidebar">
                  {user.titreprojet}
                  </div>
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
              <div className="header-user-info">
                <img 
                  src={selectedUser.profile_picture || "/img/user-default.png"} 
                  alt={selectedUser.username}
                  className="header-avatar"
                />
                <div className="header-info">
                  <h3>{selectedUser.first_name} {selectedUser.last_name}</h3>
                  <p>{selectedUser.titreprojet}</p>
                </div>
              </div>
              
              <button 
                className="project-finish-btn"
                onClick={handleProjectFinish}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Projet fini
              </button>
            </div>

            <div className="messages-content">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>Aucun message encore. Commencez la conversation !</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((message, index) => (
                    <div key={message.id} className={`message ${message.sender === 'current_user' ? 'sent' : 'received'} ${message.isSystemMessage ? 'system-message' : ''}`}>
                          <div className="message-content">
                            {message.content}
                          <div className="message-time">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              )}
            </div>

            <div className="messages-input">
              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <label htmlFor="file-input" className="file-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </label>
              {selectedFile && (
                <span className="selected-file">
                  {selectedFile.name}
                </span>
              )}
              <input
                type="text"
                placeholder="Écrivez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} disabled={!newMessage.trim() && !selectedFile}>
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

      {/* Modal de notation */}
      {showRatingModal && (
        <div className="rating-modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rating-modal-header">
              <h3>Évaluer le projet</h3>
              <button 
                className="close-modal" 
                onClick={() => setShowRatingModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="rating-modal-content">
              <p>Comment évaluez-vous le travail de <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> sur le projet <strong>{selectedUser.titreprojet}</strong> ?</p>
              
              <div className="rating-stars">
                {renderStars()}
              </div>
              
              <div className="rating-labels">
                <span>Très mauvais</span>
                <span>Excellent</span>
              </div>
              
              {selectedRating > 0 && (
                <p className="selected-rating">
                  Note sélectionnée: {selectedRating}/5 étoiles
                </p>
              )}
            </div>
            
            <div className="rating-modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setShowRatingModal(false)}
              >
                Annuler
              </button>
              <button 
                className="submit-btn" 
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
