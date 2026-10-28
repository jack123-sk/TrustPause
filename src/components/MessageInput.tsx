import React from 'react';
import { Search, RotateCcw, Lock } from 'lucide-react';

interface MessageInputProps {
  messageText: string;
  onChangeText: (text: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  onChangeText,
  onAnalyze,
  onClear,
  isAnalyzing,
}) => {
  const charCount = messageText.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim().length > 0) {
      onAnalyze();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="card-header-bar">
        <div className="card-title-group">
          <span className="step-indicator-badge" aria-hidden="true">2</span>
          <label htmlFor="message-text" className="card-title-label">
            <h2>Paste the message you received</h2>
          </label>
        </div>
      </div>

      <div className="input-textarea-wrapper">
        <textarea
          id="message-text"
          name="messageText"
          className="message-textarea"
          rows={5}
          value={messageText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Paste SMS, WhatsApp text, email, or digital payment alert here... (e.g. 'Your ₹2,000 refund is ready. Pay a fee of ₹199 to claim it.')"
          aria-describedby="textarea-privacy-note"
        />
        <div className="textarea-footer-meta">
          <span id="textarea-privacy-note" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} aria-hidden="true" /> Evaluated locally in-memory. Zero network requests.
          </span>
          <span>{charCount} characters</span>
        </div>
      </div>

      <div className="action-buttons-group">
        <button
          type="submit"
          className="btn-primary"
          disabled={isAnalyzing || messageText.trim().length === 0}
          aria-label="Analyse message for intent mismatch and scam indicators"
        >
          <Search size={18} aria-hidden="true" />
          <span>{isAnalyzing ? 'Analyzing Message...' : 'Analyse Message'}</span>
        </button>

        {messageText.length > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onClear}
            aria-label="Clear message input"
          >
            <RotateCcw size={16} aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </form>
  );
};
