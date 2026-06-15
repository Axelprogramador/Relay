import { useState } from 'react'

function MessageInput({ onSend }) {
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    onSend(content.trim())
    setContent('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        <textarea
          style={styles.textarea}
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          style={content.trim() ? styles.button : styles.buttonDisabled}
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <p style={styles.hint}>Enter to send · Shift+Enter for new line</p>
    </div>
  )
}

const styles = {
  container: {
    padding: '1rem 1.5rem 1.25rem',
    borderTop: '1px solid var(--border)',
    background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)'
  },
  inputWrapper: {
    display: 'flex', alignItems: 'flex-end', gap: '0.75rem',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '0.5rem 0.5rem 0.5rem 1rem'
  },
  textarea: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--text-primary)', fontSize: '0.95rem', resize: 'none',
    fontFamily: 'inherit', lineHeight: '1.5', padding: '0.4rem 0',
    maxHeight: '120px', overflowY: 'auto'
  },
  button: {
    width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-gradient)', border: 'none',
    color: 'white', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: 'var(--shadow-accent)', transition: 'opacity 0.2s'
  },
  buttonDisabled: {
    width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    color: 'var(--text-muted)', cursor: 'not-allowed', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  hint: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', paddingLeft: '0.25rem' }
}

export default MessageInput