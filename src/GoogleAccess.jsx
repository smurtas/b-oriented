import { useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import './GoogleAccess.css'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
let googleScriptPromise

function ensureGoogleIdentityServices() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = resolve
      script.onerror = () => reject(new Error('Impossibile caricare il login Google.'))
      document.head.appendChild(script)
    }).catch(err => { googleScriptPromise = null; throw err })
  }
  return googleScriptPromise
}

export default function GoogleAccess() {
  const { user, checking, sessionError, loginWithGoogle, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const googleButtonRef = useRef(null)

  useEffect(() => {
    if (!open || user || checking) return
    let active = true

    async function initialize() {
      setBusy(true)
      setError('')
      try {
        if (!CLIENT_ID) throw new Error('VITE_GOOGLE_CLIENT_ID non configurato.')
        const response = await fetch('/api/auth/nonce', {
          credentials: 'same-origin', cache: 'no-store',
        })
        if (!response.ok) throw new Error('Backend di autenticazione non disponibile.')
        const { nonce } = await response.json()
        if (!nonce) throw new Error('Nonce di accesso mancante.')
        await ensureGoogleIdentityServices()
        if (!active || !googleButtonRef.current) return
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          nonce,
          hd: 'buonarroti.tn.it', // Suggerimento UI: la verifica è sul server.
          auto_select: false,
          callback: async ({ credential }) => {
            try {
              if (!credential) throw new Error('Credenziale Google assente.')
              await loginWithGoogle(credential)
              if (active) { setOpen(false); setError('') }
            } catch (err) {
              if (active) { setError(err.message); setAttempt(a => a + 1) }
            }
          },
        })
        googleButtonRef.current.replaceChildren()
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard', theme: 'outline', size: 'large',
          text: 'signin_with', shape: 'rectangular', width: 256,
        })
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setBusy(false)
      }
    }
    initialize()
    return () => { active = false }
  }, [open, user, checking, attempt, loginWithGoogle])

  async function handleLogout() {
    setBusy(true)
    setError('')
    try {
      await logout()
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const roleName = user?.role === 'admin' ? 'Amministratore'
    : user?.role === 'teacher' ? 'Docente' : 'Studente'

  return (
    <div className="bo-access">
      <button
        type="button"
        className="bo-access-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => { setOpen(o => !o); setError('') }}
      >
        <span aria-hidden="true">♙</span>
        <span>{checking ? 'Accesso…' : user ? user.name : 'Accedi'}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <section className="bo-access-panel" role="dialog" aria-label="Area riservata">
          <div className="bo-access-panel-head">
            <strong>Area riservata</strong>
            <button type="button" className="bo-access-close" aria-label="Chiudi" onClick={() => setOpen(false)}>×</button>
          </div>
          {user ? (
            <>
              <p className="bo-access-name">{user.name}</p>
              <p className="bo-access-muted">{roleName} · {user.email}</p>
              <p className="bo-access-muted">
                {user.role === 'student'
                  ? 'I tuoi risultati saranno disponibili quando attiveremo il database.'
                  : 'La dashboard docenti sarà disponibile nella prossima fase.'}
              </p>
              <button type="button" className="bo-access-logout" disabled={busy} onClick={handleLogout}>
                {busy ? 'Disconnessione…' : 'Esci'}
              </button>
            </>
          ) : (
            <>
              <p className="bo-access-muted">Accedi con il tuo account Google scolastico. Studenti e docenti vengono riconosciuti automaticamente.</p>
              <div ref={googleButtonRef} className="bo-access-google" />
              {busy && <p className="bo-access-muted">Preparazione del login…</p>}
              <p className="bo-access-muted">Puoi anche chiudere questa finestra e iniziare il questionario come ospite.</p>
              {sessionError && <p className="bo-access-muted">{sessionError}</p>}
            </>
          )}
          {error && <p className="bo-access-error" role="alert">{error}</p>}
        </section>
      )}
    </div>
  )
}
