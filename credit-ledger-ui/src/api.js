export const API = 'http://localhost:8080/api/customers'
export const AUTH_API = 'http://localhost:8080/api/auth'

export function authFetch(url, options = {}) {
  const token = localStorage.getItem('token')
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: 'Bearer ' + token,
    },
  })
}