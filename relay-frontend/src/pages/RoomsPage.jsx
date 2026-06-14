import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDesc, setNewRoomDesc] = useState('')
  const [error, setError] = useState('')
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
    try {
      await api.post('/rooms', { name: newRoomName, description: newRoomDesc })
      setNewRoomName('')
      setNewRoomDesc('')
      fetchRooms()
    } catch (err) {
      setError('Failed to create room')
    }
  }

  const handleJoinRoom = async (roomId) => {
    try {
      await api.post(`/rooms/${roomId}/join`)
      navigate(`/chat/${roomId}`)
    } catch (err) {
      navigate(`/chat/${roomId}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Relay</h1>
        <div style={styles.headerRight}>
          <span style={styles.username}>👤 {username}</span>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.createCard}>
          <h2 style={styles.sectionTitle}>Create a room</h2>
          {error && <p style={styles.error}>{error}</p>}
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
            <button style={styles.button} type="submit">Create</button>
          </form>
        </div>

        <div style={styles.roomsCard}>
          <h2 style={styles.sectionTitle}>Available rooms</h2>
          {rooms.length === 0 ? (
            <p style={styles.empty}>No rooms yet. Create one!</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} style={styles.roomItem}>
                <div>
                  <p style={styles.roomName}>{room.name}</p>
                  {room.description && <p style={styles.roomDesc}>{room.description}</p>}
                </div>
                <button style={styles.joinButton} onClick={() => handleJoinRoom(room.id)}>
                  Join
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#4f46e5', color: 'white' },
  title: { margin: 0, fontSize: '1.5rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  username: { fontSize: '0.95rem' },
  logoutButton: { padding: '0.4rem 1rem', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '6px', cursor: 'pointer' },
  content: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  createCard: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  roomsCard: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  sectionTitle: { margin: '0 0 1rem 0', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.75rem', borderRadius: '6px', border: