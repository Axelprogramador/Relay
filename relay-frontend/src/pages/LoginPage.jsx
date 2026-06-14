import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await api.post('/auth/login', { email, password })
      const token = response.data.token

      const payload = JSON.parse(atob(token.split('.')[1]))
      login(token, payload.sub)

      navigate('/rooms')
    } catch (err) {
      // Mensaje genérico, evita enum attacks
      setError('Invalid credentials')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Relay</h1>
        <h2 style={styles.subtitle}>Sign in</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Sign in</button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', width: '360px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { margin: 0, color: '#4f46e5', fontSize: '1.8rem' },
  subtitle: { marginBottom: '1.5rem', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '0.5rem' },
  link: { marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }
}

export default LoginPage