import { Routes, Route, useNavigate } from 'react-router-dom'
import CustomerList from './pages/CustomerList'
import CustomerDetail from './pages/CustomerDetails'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <header className="topbar">
  <h1>Credit Ledger</h1>
  <p>Track customer credit and payments</p>
  {token && (
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  )}
</header>

      <main className="container">
        <Routes>
  <Route path="/" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
  <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
  <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  )
}

export default App