import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useWebSocket } from '../hooks/useWebSocket.js'
import api from '../api/axios.js'
import { useState } from 'react'
import MessageList from '../components/MessageList.jsx'
import MessageInput from '../components/MessageInput.jsx'

function ChatPage() {
  const { roomId } = useParams()
  const { token, username } = useAuth()
  const { messages, sendMessage } = useWebSocket(roomId, token)
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Carga historial de mensajes al entrar a sala
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
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/rooms')}>← Back</button>
        <h2 style={styles.title}>Room {roomId}</h2>
        <span style={styles.username}>👤 {username}</span>
      </div>
      <MessageList messages={allMessages} currentUsername={username} />
      <MessageInput onSend={sendMessage} />
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', backgroundColor: '#4f46e5', color: 'white' },
  backButton: { background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' },
  title: { margin: 0, flex: 1 },
  username: { fontSize: '0.95rem' }
}

export default ChatPage