import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

async function getJson(response) {
  let data
  try { data = await response.json() } catch { data = {} }
  if (!response.ok) throw new Error(data.error || `Errore API (${response.status})`)
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/auth/me', {
      credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
    })
      .then(getJson)
      .then(data => { setUser(data.authenticated ? data.user : null); setSessionError('') })
      .catch(err => {
        if (err.name !== 'AbortError') setSessionError('Verifica della sessione non disponibile.')
      })
      .finally(() => { if (!controller.signal.aborted) setChecking(false) })
    return () => controller.abort()
  }, [])

  const loginWithGoogle = useCallback(async credential => {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    })
    const data = await getJson(response)
    setUser(data.user)
    setSessionError('')
    return data.user
  }, [])

  const logout = useCallback(async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST', credentials: 'same-origin',
    })
    await getJson(response)
    window.google?.accounts?.id?.disableAutoSelect()
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    user, authenticated: Boolean(user), checking, sessionError,
    loginWithGoogle, logout,
  }), [user, checking, sessionError, loginWithGoogle, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth richiede AuthProvider')
  return context
}
