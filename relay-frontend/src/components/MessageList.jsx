import { useEffect, useRef } from 'react'

function MessageList({ messages, currentUsername }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={styles.container}>
      {messages.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💬</div>
          <p style={styles.emptyText}>No messages yet</p>
          <p style={styles.emptySubtext}>Be the first to say something!</p>
        </div>
      )}
      {messages.map((msg, index) => {
        const isOwn = msg.senderUsername === currentUsername
        const initial = msg.senderUsername?.[0]?.toUpperCase() ?? '?'

        return (
          <div
            key={msg.id ?? index}
            style={{ ...styles.messageWrapper, flexDirection: isOwn ? 'row-reverse' : 'row' }}
          >
            {/* Avatar */}
            <div style={isOwn ? styles.avatarOwn : styles.avatarOther}>
              {initial}
            </div>

            <div style={{ maxWidth: '60%', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
              {/* Sender name — solo para mensajes ajenos */}
              {!isOwn && (
                <p style={styles.senderName}>{msg.senderUsername ?? 'Unknown'}</p>
              )}

              {/* Burbuja */}
              <div style={isOwn ? styles.bubbleOwn : styles.bubbleOther}>
                <p style={styles.content}>{msg.content}</p>
                <p style={{ ...styles.time, textAlign: isOwn ? 'right' : 'left' }}>
                  {msg.sentAt
                    ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </p>
              </div>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

const styles = {
  container: {
    flex: 1, overflowY: 'auto', padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '1rem'
  },
  emptyState: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '4rem 0', gap: '0.5rem'
  },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  emptyText: { color: 'var(--text-secondary)', fontWeight: '500' },
  emptySubtext: { color: 'var(--text-muted)', fontSize: '0.85rem' },
  messageWrapper: {
    display: 'flex', alignItems: 'flex-end', gap: '0.5rem'
  },
  avatarOther: {
    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #374151, #6b7280)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: '700', color: 'white'
  },
  avatarOwn: {
    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
    background: 'var(--accent-gradient)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: '700', color: 'white'
  },
  senderName: {
    fontSize: '0.75rem', color: 'var(--text-muted)',
    paddingLeft: '0.25rem', margin: 0
  },
  bubbleOwn: {
    background: 'var(--accent-gradient)',
    borderRadius: '16px 16px 4px 16px',
    padding: '0.75rem 1rem',
    boxShadow: 'var(--shadow-accent)'
  },
  bubbleOther: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px 16px 16px 4px',
    padding: '0.75rem 1rem',
    backdropFilter: 'blur(8px)'
  },
  content: {
    fontSize: '0.95rem', lineHeight: '1.5',
    color: 'var(--text-primary)', margin: 0
  },
  time: {
    fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)',
    margin: '0.25rem 0 0 0'
  }
}
export default MessageList