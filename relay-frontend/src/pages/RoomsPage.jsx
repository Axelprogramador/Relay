import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { hasUnreadMessages } from '../utils/readTracker.js'
import api from '../api/axios.js'

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDesc, setNewRoomDesc] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms')
      setRooms(response.data)
    } catch (err) {
      setError('Failed to load rooms')
    }
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/rooms', { name: newRoomName, description: newRoomDesc })
      setNewRoomName('')
      setNewRoomDesc('')
      fetchRooms()
    } catch (err) {
      setError('Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (roomId) => {
    try {
      await api.post(`/rooms/${roomId}/join`)
    } catch (err) {
      // Si ya es miembro redirigimos igualmente
    }
    navigate(`/chat/${roomId}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>⚡</span>
          <span style={styles.brand}>Relay</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.userBadge}>
            <div style={styles.avatar}>{username?.[0]?.toUpperCase()}</div>
            <span style={styles.username}>{username}</span>
          </div>
          <button style={styles.logoutButton} onClick={handleLogout}>Sign out</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Create room card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span style={styles.cardIcon}>+</span> New Room
          </h2>
          {error && (
            <div style={styles.errorBox}>⚠ {error}</div>
          )}
          <form onSubmit={handleCreateRoom} style={styles.form}>
            <input
              style={styles.input}
              type="text"
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Description (optional)"
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
            />
            <button style={loading ? styles.buttonDisabled : styles.button} type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </div>

        {/* Rooms list */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span style={styles.cardIcon}>#</span> Available Rooms
          </h2>
          {rooms.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No rooms yet.</p>
              <p style={styles.emptySubtext}>Create one to start chatting.</p>
            </div>
          ) : (
            <div style={styles.roomList}>
              {rooms.map((room) => {
                const unread = hasUnreadMessages(room.id, room.lastMessageAt)
                return (
                  <div key={room.id} style={styles.roomItem}>
                    <div style={styles.roomInfo}>
                      <div style={unread ? styles.roomDotUnread : styles.roomDot} />
                      <div>
                        <p style={styles.roomName}>{room.name}</p>
                        {room.description && (
                          <p style={styles.roomDesc}>{room.description}</p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {unread && <span style={styles.unreadBadge}>New</span>}
                      <button style={styles.joinButton} onClick={() => handleJoinRoom(room.id)}>
                        Join →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: 'var(--bg-primary)' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', borderBottom: '1px solid var(--border)',
    background: 'rgba(15,15,19,0.8)', backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 10
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logo: { fontSize: '1.4rem' },
  brand: {
    fontSize: '1.3rem', fontWeight: '800',
    background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'var(--accent-gradient)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', fontWeight: '700', color: 'white'
  },
  username: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  logoutButton: {
    padding: '0.4rem 1rem', background: '#1e1e2e',
    color: 'var(--text-primary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem'
  },
  content: {
    maxWidth: '720px', margin: '2rem auto', padding: '0 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '1.5rem'
  },
  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '1.75rem',
    backdropFilter: 'blur(12px)', boxShadow: 'var(--shadow-sm)'
  },
  cardTitle: {
    fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)',
    marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
  },
  cardIcon: {
    width: '28px', height: '28px', background: 'var(--accent-gradient)',
    borderRadius: 'var(--radius-sm)', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'white'
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
    color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)',
    color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none'
  },
  button: {
    padding: '0.875rem', background: 'var(--accent-gradient)',
    color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
    boxShadow: 'var(--shadow-accent)'
  },
  buttonDisabled: {
    padding: '0.875rem', background: 'var(--accent-gradient)',
    color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'not-allowed', opacity: 0.5
  },
  emptyState: { textAlign: 'center', padding: '2rem 0' },
  emptyText: { color: 'var(--text-secondary)', marginBottom: '0.25rem' },
  emptySubtext: { color: 'var(--text-muted)', fontSize: '0.85rem' },
  roomList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  roomItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)',
    transition: 'background 0.2s'
  },
  roomInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  roomDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: 'var(--accent-gradient)', flexShrink: 0
  },
  roomDotUnread: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#4ade80', flexShrink: 0,
    boxShadow: '0 0 8px rgba(74,222,128,0.6)'
  },
  unreadBadge: {
    fontSize: '0.7rem', fontWeight: '600', color: '#4ade80',
    background: 'rgba(74,222,128,0.1)', padding: '0.2rem 0.5rem',
    borderRadius: '4px', border: '1px solid rgba(74,222,128,0.3)'
  },
  roomName: { fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.15rem' },
  roomDesc: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  joinButton: {
    padding: '0.4rem 1rem', background: 'var(--accent-purple)',
    color: 'white', border: 'none',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem',
    fontWeight: '500', flexShrink: 0
  }
}

export default RoomsPage