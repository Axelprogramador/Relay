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
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          style={styles.textarea}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button style={styles.button} type="submit">Send</button>
      </form>
    </div>
  )
}

const styles = {
  container: { padding: '1rem 2rem', backgroundColor: 'white', borderTop: '1px solid #eee' },
  form: { display: 'flex', gap: '0.75rem', alignItems: 'flex-end' },
  textarea: { flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', resize: 'none', fontFamily: 'inherit' },
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap' }
}

export default MessageInput