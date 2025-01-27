'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchMessages, createMessage } from '../../../../store/slices/messageSlice';
import Image from 'next/image';

const Messages = () => {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();
  const { messages, status, error } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchMessages(eventId));
    }
  }, [dispatch, eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;

    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('event', eventId);
    formData.append('sender', user.id);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    await dispatch(createMessage(formData));
    setNewMessage('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {status === 'loading' && <p className="loading">Loading messages...</p>}
        {status === 'failed' && <p className="error">Error: {error}</p>}
        
        <div className="messages-list">
          {[...messages]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === user.id ? 'own-message' : ''}`}
              >
                <div className="message-header">
                  {message.sender_image ? (
                    <Image
                      src={message.sender_image}
                      alt={message.sender_username}
                      width={40}
                      height={40}
                      className="sender-avatar"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="default-avatar">
                      {message.sender_username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="sender-name">{message.sender_username}</span>
                  <span className="message-time">{formatDate(message.created_at)}</span>
                </div>
                <div className="message-content">
                  <p>{message.content}</p>
                  {message.image && (
                    <div className="message-image">
                      <Image
                        src={message.image}
                        alt="Message attachment"
                        width={200}
                        height={200}
                        className="attached-image"
                        onError={(e) => {
                          e.target.src = '/image-placeholder.png';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button 
              type="button" 
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="remove-image"
            >
              ×
            </button>
          </div>
        )}
        <div className="form-controls">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <label className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            📎
          </label>
          <button type="submit" className="send-button" disabled={!newMessage.trim() && !selectedImage}>
            Send
          </button>
        </div>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 100px);
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        .messages-container {
          flex-grow: 1;
          overflow-y: auto;
          margin-bottom: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem;
        }

        .messages-list {
          display: flex;
          flex-direction: column-reverse;
          gap: 1rem;
        }

        .message {
          padding: 1rem;
          border-radius: 8px;
          background: #f8f9fa;
          max-width: 80%;
        }

        .own-message {
          margin-left: auto;
          background: #e3f2fd;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .sender-name {
          font-weight: 500;
          color: #2196f3;
        }

        .message-time {
          font-size: 0.8rem;
          color: #666;
          margin-left: auto;
        }

        .message-content {
          word-break: break-word;
        }

        .message-content p {
          margin: 0;
        }

        .message-form {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
        }

        .form-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .message-input {
          flex-grow: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .image-upload {
          padding: 0.5rem;
          cursor: pointer;
          font-size: 1.5rem;
        }

        .send-button {
          padding: 0.75rem 1.5rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .send-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .image-preview {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .image-preview img {
          max-width: 200px;
          max-height: 200px;
          border-radius: 4px;
        }

        .remove-image {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ff5252;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .loading {
          text-align: center;
          color: #666;
        }

        .error {
          text-align: center;
          color: #ff5252;
        }

        .sender-avatar {
          border-radius: 50%;
          object-fit: cover;
        }

        .attached-image {
          border-radius: 4px;
          margin-top: 0.5rem;
          max-width: 100%;
          height: auto;
        }

        .default-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2196f3;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default Messages;