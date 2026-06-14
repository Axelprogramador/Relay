import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios.js'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/register', { username, email, password })
      // Redirige a login cuando se crea usuario
      navigate('/login')
    } catch (err) {
      setError('Registration failed. Email may already be in use.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Relay</h1>
        <h2 style={styles.subtitle}>Create account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
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

export default RegisterPage