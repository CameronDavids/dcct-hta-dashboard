import { FormEvent, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('')
    if (!isSupabaseConfigured) { setError('Add your Supabase URL and anon key to .env.local first.'); setBusy(false); return }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError(authError.message)
    setBusy(false)
  }
  return <main className="login-shell"><section className="login-panel"><div className="brand-mark">DCCT</div><p className="eyebrow">DEAF COMMUNITY OF CAPE TOWN</p><h1>HTA indicator dashboard</h1><p className="login-copy">Sign in with your invited staff account to monitor monthly HIV Testing & Awareness programme performance.</p><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form></section></main>
}
