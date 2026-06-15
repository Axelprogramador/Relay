import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useWebSocket } from '../hooks/useWebSocket.js'
import api from '../api/axios.js'
import MessageList from '../components/MessageList.jsx'
import MessageInput from '../components/MessageInput.jsx'

function ChatPage() {
  const { roomId } = useParams()
  const { token, username } = useAuth()
  const { messages, sendMessage } = useWebSocket(roomId, token)
  const [history, setHistory] = useState([])
  const [roomName, setRoomName] = useState(`Room ${roomId}`)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/rooms/${roomId}/messages`)
        setHistory(response.data)
      } catch (err) {
        console.error('Failed to load history', err)
      }
    }
    fetchHistory()
  }, [roomId])

  const allMessages = [
    ...history,
    ...messages.filter(m => !history.find(h => h.id === m.id))
  ]

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={() => navigate('/rooms')}>
            ← Back
          </button>
          <div style={styles.roomInfo}>
            <div style={styles.roomDot} />
            <div>
              <h2 style={styles.roomName}>{roomName}</h2>
              <span style={styles.roomStatus}>● Live</span>
            </div>
          </div>
        </div>
        <div style={styles.userBadge}>
          <div style={styles.avatar}>{username?.[0]?.toUpperCase()}</div>
          <span style={styles.username}>{username}</span>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={allMessages} currentUsername={username} />

      {/* Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  )
}

const styles = {
  container: {
    display: 'flex', flexDirection: 'column', height: '100vh',
    backgroundColor: 'var(--bg-primary)'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)',
    background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 10
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  backButton: {
    background: 'transparent', color: 'var(--text-secondary)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
    padding: '0.4rem 0.875rem', cursor: 'pointer', fontSize: '0.85rem',
    transition: 'all 0.2s'
  },
  roomInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  roomDot: {
    width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-gradient)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
  },
  roomName: { fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' },
  roomStatus: { fontSize: '0.75rem', color: '#4ade80' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'var(--accent-gradient)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', fontWeight: '700', color: 'white'
  },
  username: { color: 'var(--text-secondary)', fontSize: '0.9rem' }
}

export default ChatPage