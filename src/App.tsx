import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useHtaMonths } from './lib/useHtaMonths'
import { exportMonthsCsv, getFyQuarter } from './lib/utils'
import type { FyQuarter, HtaMonth, HtaMonthInput } from './types'
import { Login } from './components/Login'
import { Sidebar } from './components/Sidebar'
import { KpiCards } from './components/KpiCards'
import { PerformanceChart } from './components/PerformanceChart'
import { MonthTable } from './components/MonthTable'
import { MonthModal } from './components/MonthModal'

export default function App() { const [session, setSession] = useState<unknown>(null); const [authLoading, setAuthLoading] = useState(true); const { months, loading, error, saveMonth, deleteMonth } = useHtaMonths(); const [filters, setFilters] = useState({ from: '', to: '', quarter: 'All' as FyQuarter | 'All', metric: 'reach' }); const [editing, setEditing] = useState<HtaMonth | null>(null); const [modalOpen, setModalOpen] = useState(false)
  useEffect(() => { void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthLoading(false) }); const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession)); return () => data.subscription.unsubscribe() }, [])
  const filtered = useMemo(() => months.filter((item) => (!filters.from || item.id >= filters.from) && (!filters.to || item.id <= filters.to) && (filters.quarter === 'All' || getFyQuarter(item.month) === filters.quarter)), [months, filters])
  const monthIds = months.map((item) => item.id)
  const updateFilter = (key: string, value: string) => setFilters((current) => ({ ...current, [key]: key === 'quarter' ? value as FyQuarter | 'All' : value }))
  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const save = async (data: HtaMonthInput) => { await saveMonth(data) }
  if (authLoading) return <div className="loading-screen">Loading dashboard...</div>
  if (!session) return <Login />
  const latestMonth = months[months.length - 1]
  return <div className="app-shell"><Sidebar {...filters} months={monthIds} onChange={updateFilter} onClear={() => setFilters({ from: '', to: '', quarter: 'All', metric: 'reach' })} onAdd={openAdd} onExport={() => exportMonthsCsv(filtered)} /><main className="main-content"><header className="page-header"><div><p className="eyebrow">DEAF COMMUNITY OF CAPE TOWN</p><h1>TARGET AGAINST PERFORMANCE</h1><p className="subtitle">DCCT - HTA Indicator Dashboard</p></div><div className="header-meta"><span>Last updated</span><strong>{latestMonth?.updatedAt ? new Date(latestMonth.updatedAt).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Awaiting data'}</strong><button onClick={() => supabase.auth.signOut()}>Sign out</button></div></header>{error && <div className="error-banner">{error}</div>}{loading ? <div className="loading-screen">Loading programme data...</div> : <><KpiCards months={filtered} /><PerformanceChart months={filtered} metric={filters.metric} /><MonthTable months={filtered} onEdit={(month) => { setEditing(month); setModalOpen(true) }} /></>}</main>{modalOpen && <MonthModal month={editing} onClose={() => setModalOpen(false)} onSave={save} onDelete={deleteMonth} />}</div>
}
