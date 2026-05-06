import { useState, KeyboardEvent } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: 8,
        background: '#fff',
      }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Mesaj yaz... (Enter gönder, Shift+Enter yeni satır)"
        rows={1}
        disabled={disabled}
        style={{
          flex: 1,
          resize: 'none',
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          fontSize: 14,
          fontFamily: 'inherit',
          outline: 'none',
          lineHeight: 1.5,
        }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        style={{
          padding: '8px 18px',
          borderRadius: 8,
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
          fontWeight: 500,
          fontSize: 14,
          opacity: !value.trim() || disabled ? 0.5 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        Gönder
      </button>
    </div>
  );
}
