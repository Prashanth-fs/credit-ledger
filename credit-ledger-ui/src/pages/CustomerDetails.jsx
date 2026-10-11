import { useEffect, useState } from 'react'
import { API, authFetch } from '../api'
import { Link, useNavigate, useParams } from 'react-router-dom'

function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [pending, setPending] = useState(0)
  const [refresh, setRefresh] = useState(0)

  const [amount, setAmount] = useState('')
  const [type, setType] = useState('CREDIT')
  const [note, setNote] = useState('')


  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editMobile, setEditMobile] = useState('')
  const [editLocation, setEditLocation] = useState('')

  useEffect(() => {
    authFetch(`${API}/${id}`)
      .then(response => response.json())
      .then(data => setCustomer(data))

    authFetch(`${API}/${id}/transactions`)
      .then(response => response.json())
      .then(data => setTransactions(data))

    authFetch(`${API}/${id}/pending`)
      .then(response => response.json())
      .then(data => setPending(data))
  }, [id, refresh])

  const handleSubmit = (e) => {
    e.preventDefault()

    authFetch(`${API}/${id}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), type, note })
    })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message)
        }
        return response.json()
      })
      .then(() => {
        setAmount('')
        setNote('')
        setRefresh(refresh + 1)
      })
      .catch(error => alert(error.message))
  }

    const handleDelete = () => {
    if (!window.confirm('Delete this customer?')) return

    authFetch(`${API}/${id}`, { method: 'DELETE' })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message)
        }
        navigate('/')
      })
      .catch(error => alert(error.message))
  }

    const startEdit = () => {
    setEditName(customer.name)
    setEditMobile(customer.mobile)
    setEditLocation(customer.location || '')
    setEditing(true)
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    authFetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName,mobile: editMobile,location: editLocation})
    })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message)
        }
        return response.json()
      })
      .then(() => {
        setEditing(false)
        setRefresh(refresh + 1)
      })
      .catch(error => alert(error.message))
  }

    const sendReminder = () => {
    const message = `Hello ${customer.name}, your pending amount is ₹${Number(pending).toLocaleString('en-IN')}. Please pay when you can. Thank you.`
    const link = `https://wa.me/91${customer.mobile}?text=${encodeURIComponent(message)}`
    window.open(link, '_blank')
  }

  if (!customer) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Link to="/" className="back">← Back to customers</Link>

      <section className="card detail-head">
        <div>
          <h2>{customer.name}</h2>
          <p className="muted">{customer.mobile} • {customer.location}</p>
        </div>
        <div className="pending-box">
          <div className="label">Pending amount</div>
          <span className={pending > 0 ? 'badge due' : 'badge clear'}>
            ₹{Number(pending).toLocaleString('en-IN')}
          </span> 
         <br />
             <div className="actions">
            <button className="btn" onClick={startEdit}>Edit</button>
            <button className="btn danger" onClick={handleDelete}>Delete Customer</button>
              {pending > 0 && (
    <button className="btn" onClick={sendReminder}>WhatsApp Reminder</button>
  )}
          </div>
        </div>

      {editing && (
        <section className="card">
          <h2>Edit Customer</h2>
          <form className="form" onSubmit={handleUpdate}>
            <input placeholder="Name" value={editName}
                   onChange={e => setEditName(e.target.value)} required />
            <input placeholder="Mobile" value={editMobile}
                   onChange={e => setEditMobile(e.target.value)}
                   pattern="[0-9]{10}" maxLength="10"
                   title="Enter a 10 digit mobile number" required />
            <input placeholder="Location" value={editLocation}
                   onChange={e => setEditLocation(e.target.value)} />
            <button className="btn" type="submit">Save</button>
            <button className="btn secondary" type="button"
                    onClick={() => setEditing(false)}>Cancel</button>
          </form>
        </section>
      )}



      </section>

      <section className="card">
        <h2>Add Entry</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input type="number" placeholder="Amount" min="1" value={amount}
                 onChange={e => setAmount(e.target.value)} required />
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="CREDIT">Credit   (goods given)</option>
            <option value="PAYMENT">Payment (money received)</option>
          </select>
          <input placeholder="Note (optional)" value={note}
                 onChange={e => setNote(e.target.value)} />
          <button className="btn" type="submit">Add Entry</button>
        </form>
      </section>

      <section className="card">
        <h2>Ledger History</h2>
        {transactions.length === 0 ? (
          <p className="muted">No entries yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {[...transactions].reverse().map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>
                      <span className={t.type === 'CREDIT' ? 'badge due' : 'badge clear'}>
                        {t.type}
                      </span>
                    </td>
                    <td>₹{Number(t.amount).toLocaleString('en-IN')}</td>
                    <td>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default CustomerDetail