import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import { CONSULT_STATUS } from '../../shared/tokens.js'
import Modal from '../../shared/components/Modal.jsx'
import Button from '../../shared/components/Button.jsx'
import { Field, TextArea, Select } from '../../shared/components/Field.jsx'

const STATUS_OPTIONS = ['confirmed', 'completed', 'linked', 'cancelled'].map((id) => ({
  id,
  en: CONSULT_STATUS[id].en,
}))

// Register / update the outcome of a consultation.
export default function ResultRegistrationModal({ open, onClose, consultation, readOnly = false }) {
  const { manufacturers, updateConsultation, factoryById } = useApp()
  const [factoryId, setFactoryId] = useState('')
  const [status, setStatus] = useState('confirmed')
  const [notes, setNotes] = useState('')

  const verified = useMemo(
    () => manufacturers.filter((m) => m.status === 'verified'),
    [manufacturers]
  )

  useEffect(() => {
    if (consultation) {
      setFactoryId(consultation.matchedFactoryId || '')
      setStatus(['confirmed', 'completed', 'linked', 'cancelled'].includes(consultation.status)
        ? consultation.status
        : 'confirmed')
      setNotes(consultation.coordinatorNotes || '')
    }
  }, [consultation])

  if (!consultation) return null

  function save() {
    updateConsultation(consultation.id, {
      matchedFactoryId: factoryId || null,
      matchScore: factoryId ? consultation.matchScore || 85 : 0,
      status,
      coordinatorNotes: notes,
      aiRecStatus: status === 'cancelled' && !factoryId ? 'excluded' : consultation.aiRecStatus,
    })
    onClose()
  }

  const title = readOnly ? `Result — ${consultation.orderNo}` : `Register Result — ${consultation.orderNo}`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        readOnly ? (
          <Button variant="subtle" onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button variant="subtle" onClick={onClose}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </>
        )
      }
    >
      <div className="space-y-4">
        <Field label="Applicant">
          <div className="rounded-2xl bg-surface px-4 py-3 text-sm font-medium text-ink">
            {consultation.applicantName}
          </div>
        </Field>

        <Field label="Matched Factory">
          {readOnly ? (
            <div className="rounded-2xl bg-surface px-4 py-3 text-sm text-ink">
              {factoryById(factoryId)?.name || '—'}
            </div>
          ) : (
            <Select
              placeholder="Select a factory…"
              options={verified.map((m) => ({ id: m.id, en: `${m.name} (${m.id})` }))}
              value={factoryId}
              onChange={(e) => setFactoryId(e.target.value)}
            />
          )}
        </Field>

        <Field label="Current Status">
          {readOnly ? (
            <div className="rounded-2xl bg-surface px-4 py-3 text-sm text-ink">
              {CONSULT_STATUS[consultation.status].en}
            </div>
          ) : (
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          )}
        </Field>

        <Field label="Coordinator Notes">
          <TextArea
            readOnly={readOnly}
            placeholder="Add notes about this consultation…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  )
}
