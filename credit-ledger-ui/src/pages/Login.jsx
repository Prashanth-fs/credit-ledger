import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_API } from '../api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch(AUTH_API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      navigate('/')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome !Sir</h2>
        <p className="login-sub">Login to manage your credit ledger</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn" type="submit">Login</button>
        </form>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  )
}

export default Login