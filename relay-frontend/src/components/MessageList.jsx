import { useEffect, useRef } from 'react'

function MessageList({ messages, currentUsername }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={styles.container}>
      {messages.length === 0 && (
        <p style={styles.empty}>No messages yet. Say something!</p>
      )}
      {messages.map((msg, index) => {
        const isOwn = msg.senderUsername === currentUsername
        return (
          <div key={msg.id ?? index} style={{ ...styles.messageWrapper, justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
            <div style={{ ...styles.bubble, backgroundColor: isOwn ? '#4f46e5' : 'white', color: isOwn ? 'white' : '#333' }}>
              {!isOwn && <p style={styles.sender}>{msg.senderUsername}</p>}
              <p style={styles.content}>{msg.content}</p>
              <p style={styles.time}>{msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ''}</p>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

const styles = {
  container: { flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  empty: { textAlign: 'center', color: '#999', marginTop: '2rem' },
  messageWrapper: { display: 'flex' },
  bubble: { maxWidth: '60%', padding: '0.75rem 1rem', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  sender: { margin: '0 0 0.25rem 0', fontSize: '0.75rem', fontWeight: 'bold', color: '#4f46e5' },
  content: { margin: 0, fontSize: '0.95rem', lineHeight: '1.4' },
  time: { margin: '0.25rem 0 0 0', fontSize: '0.7rem', opacity: 0.7, textAlign: 'right' }
}

export default MessageList