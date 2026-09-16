export type FyQuarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

export interface HtaMonth {
  id: string
  year: number
  month: number
  reach: number | null
  target: number | null
  hivTests: number | null
  stiTreated: number | null
  condomsMale: number | null
  condomsFemale: number | null
  outreaches: number | null
  supportGroups: number | null
  note: string | null
  updatedAt: string
}

export type HtaMonthInput = Omit<HtaMonth, 'updatedAt'> & { updatedAt?: string }
