const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const getToken = () => localStorage.getItem('recall_token')

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const raw = await res.text()
  let data = null
  try { data = raw ? JSON.parse(raw) : null } catch { data = raw }
  if (res.status === 401) {
    localStorage.removeItem('recall_token')
    localStorage.removeItem('recall_user')
    window.dispatchEvent(new CustomEvent('recall:session-expired'))
  }
  if (!res.ok) {
    const detail = data && (data.message || data.error || data.detail)
    throw new Error(detail || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  experiences: () => request('/api/interviews'),
  createExperience: (body) => request('/api/interviews', { method: 'POST', body: JSON.stringify(body) }),
  updateExperience: (id, body) => request(`/api/interviews/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteExperience: (id) => request(`/api/interviews/${id}`, { method: 'DELETE' }),
  topics: () => request('/api/learning-topics'),
  createTopic: (body) => request('/api/learning-topics', { method: 'POST', body: JSON.stringify(body) }),
  updateTopic: (id, body) => request(`/api/learning-topics/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTopic: (id) => request(`/api/learning-topics/${id}`, { method: 'DELETE' }),
  coach: (body) => request('/api/ai/analyze-interview', { method: 'POST', body: JSON.stringify(body) }),
  aiHealth: () => request('/api/ai/health')
}
export const apiBase = BASE
