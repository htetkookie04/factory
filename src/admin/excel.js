import * as XLSX from 'xlsx'
import { CONSULT_STATUS, AI_REC_STATUS, BUSINESS_TYPES } from '../shared/tokens.js'
import { formatDate } from '../shared/context/AppContext.jsx'

const btLabel = (id) => BUSINESS_TYPES.find((b) => b.id === id)?.en || id

// Client-side .xlsx export of the currently filtered consultation view.
export function exportConsultations(rows, factoryById) {
  const data = rows.map((c) => ({
    'Order No': c.orderNo,
    'Request Date': formatDate(c.requestDate),
    'Applicant Name': c.applicantName,
    'Brand Type': btLabel(c.brandType),
    'AI Recommendation': AI_REC_STATUS[c.aiRecStatus]?.en || c.aiRecStatus,
    'Current Status': CONSULT_STATUS[c.status]?.en || c.status,
    'Matched Factory': factoryById(c.matchedFactoryId)?.name || '—',
    'Match %': c.matchScore ? `${c.matchScore}%` : '—',
    Source: c.source,
    'Coordinator Notes': c.coordinatorNotes || '',
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  ws['!cols'] = [
    { wch: 12 }, { wch: 14 }, { wch: 24 }, { wch: 18 }, { wch: 16 },
    { wch: 14 }, { wch: 24 }, { wch: 9 }, { wch: 8 }, { wch: 32 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Consultations')
  XLSX.writeFile(wb, `oveile-consultations-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
