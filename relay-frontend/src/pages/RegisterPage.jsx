import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios.js'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', { username, email, password })
      navigate('/login')
    } catch (err) {
      setError('Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <span style={styles.logo}>⚡</span>
          <h1 style={styles.brand}>Relay</h1>
        </div>
        <p style={styles.tagline}>Join the conversation</p>

        {error && (
          <div style={styles.errorBox}>
            <span>⚠ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={loading ? styles.buttonDisabled : styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden'
  },
  glow: {
    position: 'absolute', width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none'
  },
  card: {
    background: 'var(--bg-card)', backdropFilter: 'blur(20px)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
    padding: '2.5rem', width: '420px', boxShadow: 'var(--shadow-md)', position: 'relative', zIndex: 1
  },
  logoWrapper: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' },
  logo: { fontSize: '1.8rem' },
  brand: {
    fontSize: '2rem', fontWeight: '800',
    background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  tagline: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' },
  errorBox: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
    color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' },
  input: {
    padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '0.875rem', background: 'var(--accent-gradient)',
    color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
    marginTop: '0.5rem', boxShadow: 'var(--shadow-accent)', transition: 'opacity 0.2s'
  },
  buttonDisabled: {
    padding: '0.875rem', background: 'var(--accent-gradient)',
    color: 'white', border: 'none', borderRadius: 'var(--radius-sm)',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'not-allowed',
    marginTop: '0.5rem', opacity: 0.6
  },
  footer: { marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }
}

export default RegisterPage