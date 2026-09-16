import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import type { HtaMonth, HtaMonthInput } from '../types'

const seedMonths: HtaMonth[] = [
  { id: '2026-04', year: 2026, month: 3, reach: 545, target: 340, hivTests: 52, stiTreated: null, condomsMale: 42000, condomsFemale: 1500, outreaches: 2, supportGroups: 2, note: null, updatedAt: '2026-08-31T00:00:00Z' },
  { id: '2026-05', year: 2026, month: 4, reach: 451, target: 340, hivTests: 55, stiTreated: null, condomsMale: 42000, condomsFemale: 1500, outreaches: 1, supportGroups: 4, note: 'Groups resumed at Ndabeni', updatedAt: '2026-08-31T00:00:00Z' },
  { id: '2026-06', year: 2026, month: 5, reach: 245, target: 340, hivTests: 29, stiTreated: null, condomsMale: 42000, condomsFemale: 1500, outreaches: 0, supportGroups: 6, note: 'No outreach - gang violence in Parkwood', updatedAt: '2026-08-31T00:00:00Z' },
  { id: '2026-07', year: 2026, month: 6, reach: 191, target: 340, hivTests: 32, stiTreated: null, condomsMale: 42540, condomsFemale: 1600, outreaches: 1, supportGroups: 6, note: 'Wellness Day with Master Your Path (18 Jul)', updatedAt: '2026-08-31T00:00:00Z' },
  { id: '2026-08', year: 2026, month: 7, reach: 331, target: 340, hivTests: null, stiTreated: 27, condomsMale: 42000, condomsFemale: 1500, outreaches: 2, supportGroups: 5, note: null, updatedAt: '2026-08-31T00:00:00Z' },
]

function fromRow(row: Record<string, unknown>): HtaMonth {
  return { id: row.id as string, year: row.year as number, month: row.month as number, reach: row.reach as number | null, target: row.target as number | null, hivTests: row.hiv_tests as number | null, stiTreated: row.sti_treated as number | null, condomsMale: row.condoms_male as number | null, condomsFemale: row.condoms_female as number | null, outreaches: row.outreaches as number | null, supportGroups: row.support_groups as number | null, note: row.note as string | null, updatedAt: row.updated_at as string }
}

function toRow(data: HtaMonthInput) {
  return { id: data.id, year: data.year, month: data.month, reach: data.reach, target: data.target, hiv_tests: data.hivTests, sti_treated: data.stiTreated, condoms_male: data.condomsMale, condoms_female: data.condomsFemale, outreaches: data.outreaches, support_groups: data.supportGroups, note: data.note }
}

export function useHtaMonths() {
  const [months, setMonths] = useState<HtaMonth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) { setMonths(seedMonths); setLoading(false); return }
    const { data, error: fetchError } = await supabase.from('hta_months').select('*').order('id')
    if (fetchError) setError(fetchError.message)
    else setMonths((data ?? []).map(fromRow))
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
    if (!isSupabaseConfigured) return
    const channel = supabase.channel('hta-months-live').on('postgres_changes', { event: '*', schema: 'public', table: 'hta_months' }, () => void load()).subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [load])

  const saveMonth = async (data: HtaMonthInput) => {
    if (!isSupabaseConfigured) { setMonths((current) => [...current.filter((item) => item.id !== data.id), { ...data, updatedAt: new Date().toISOString() }].sort((a, b) => a.id.localeCompare(b.id))); return }
    const { error: saveError } = await supabase.from('hta_months').upsert(toRow(data))
    if (saveError) throw saveError
    await load()
  }

  const deleteMonth = async (id: string) => {
    if (!isSupabaseConfigured) { setMonths((current) => current.filter((item) => item.id !== id)); return }
    const { error: deleteError } = await supabase.from('hta_months').delete().eq('id', id)
    if (deleteError) throw deleteError
    await load()
  }

  return { months, loading, error, saveMonth, deleteMonth }
}
