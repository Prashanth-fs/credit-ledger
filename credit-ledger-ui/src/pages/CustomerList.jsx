import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { API, authFetch } from '../api'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [refresh, setRefresh] = useState(0)

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [location, setLocation] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    authFetch(`${API}/summary`)
      .then(response => response.json())
      .then(data => setCustomers(data))
  }, [refresh])

  const handleSubmit = (e) => {
    e.preventDefault()

    authFetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, location })
    })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message)
        }
        return response.json()
      })
      .then(() => {
        setName('')
        setMobile('')
        setLocation('')
        setRefresh(refresh + 1)
      })
      .catch(error => alert(error.message))
  }

    const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search)
  )

  return (
    <>
      <section className="card">
        <h2>Add Customer</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input placeholder="Name" value={name}
                 onChange={e => setName(e.target.value)} required />
          <input placeholder="Mobile" value={mobile}
                 onChange={e => setMobile(e.target.value)}
                 pattern="[0-9]{10}" maxLength="10"
                 title="Enter a 10 digit mobile number" required />
          <input placeholder="Location" value={location}
                 onChange={e => setLocation(e.target.value)} />
          <button className="btn" type="submit">Add Customer</button>
        </form>
      </section>

      <section className="card">
        <h2>Customers</h2>
                <input className="search" placeholder="Search by name or mobile"
               value={search} onChange={e => setSearch(e.target.value)} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="name">
                    <Link to={`/customers/${c.id}`}>{c.name}</Link>
                  </td>
                  <td>{c.mobile}</td>
                  <td>{c.location}</td>
                  <td>
                    {c.pendingAmount < 0 ? (
                      <span className="badge clear">
               Advance ₹{Math.abs(Number(c.pendingAmount)).toLocaleString('en-IN')}
                        </span>
                 ) : (
  <span className={c.pendingAmount > 0 ? 'badge due' : 'badge clear'}>
    ₹{Number(c.pendingAmount).toLocaleString('en-IN')}
  </span>
)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default CustomerList