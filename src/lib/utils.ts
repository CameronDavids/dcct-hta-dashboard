import Papa from 'papaparse'
import type { FyQuarter, HtaMonth } from '../types'

export function getFyQuarter(month: number): FyQuarter {
  if (month >= 3 && month <= 5) return 'Q1'
  if (month >= 6 && month <= 8) return 'Q2'
  if (month >= 9 && month <= 11) return 'Q3'
  return 'Q4'
}

export function formatMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-ZA', { month: 'short', year: 'numeric' }).format(new Date(year, month, 1))
}

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat('en-ZA').format(value ?? 0)
}

export function performancePercent(reach: number | null, target: number | null): number {
  return target ? Math.round(((reach ?? 0) / target) * 100) : 0
}

export function exportMonthsCsv(months: HtaMonth[]): void {
  const rows = months.map((item) => ({
    Month: formatMonthLabel(item.year, item.month),
    Quarter: getFyQuarter(item.month),
    Reach: item.reach ?? '',
    Target: item.target ?? '',
    'HIV Tests': item.hivTests ?? '',
    'STI Treated': item.stiTreated ?? '',
    'Male Condoms': item.condomsMale ?? '',
    'Female Condoms': item.condomsFemale ?? '',
    Outreaches: item.outreaches ?? '',
    'Support Groups': item.supportGroups ?? '',
    Note: item.note ?? '',
  }))
  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'dcct-hta-data.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}
