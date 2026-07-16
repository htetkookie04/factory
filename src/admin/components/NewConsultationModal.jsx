import { useState } from 'react'
import { useApp, todayISO } from '../../shared/context/AppContext.jsx'
import {
  BUSINESS_TYPES,
  FABRIC_TYPES,
  ITEM_TYPES,
  REGIONS,
} from '../../shared/tokens.js'
import Modal from '../../shared/components/Modal.jsx'
import Button from '../../shared/components/Button.jsx'
import { Field, TextInput, Select } from '../../shared/components/Field.jsx'

// Coordinator-initiated (offline / walk-in) consultation entry.
export default function NewConsultationModal({ open, onClose }) {
  const { addConsultation, manufacturers } = useApp()
  const [form, setForm] = useState({
    applicantName: '',
    brandType: 'startup',
    fabricType: 'woven',
    itemType: 'suits',
    location: 'yangon',
    matchedFactoryId: '',
    note: '',
  })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const verified = manufacturers.filter((m) => m.status === 'verified')

  function save() {
    addConsultation({
      applicantName: form.applicantName || 'Walk-in Applicant',
      buyerId: null,
      brandType: form.brandType,
      fabricType: form.fabricType,
      itemType: form.itemType,
      location: form.location,
      matchedFactoryId: form.matchedFactoryId || null,
      matchScore: form.matchedFactoryId ? 80 : 0,
      aiRecStatus: form.matchedFactoryId ? 'recommended' : 'excluded',
      status: 'requested',
      note: form.note,
      requestDate: todayISO(),
      source: 'manual',
      transcript: [],
    })
    onClose()
    setForm({
      applicantName: '', brandType: 'startup', fabricType: 'woven',
      itemType: 'suits', location: 'yangon', matchedFactoryId: '', note: '',
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register New Consultation"
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!form.applicantName.trim()} onClick={save}>Create</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Applicant Name" required>
          <TextInput
            placeholder="Company / person name"
            value={form.applicantName}
            onChange={(e) => set('applicantName', e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand Type">
            <Select options={BUSINESS_TYPES} value={form.brandType} onChange={(e) => set('brandType', e.target.value)} />
          </Field>
          <Field label="Location">
            <Select options={REGIONS} value={form.location} onChange={(e) => set('location', e.target.value)} />
          </Field>
          <Field label="Fabric Type">
            <Select options={FABRIC_TYPES} value={form.fabricType} onChange={(e) => set('fabricType', e.target.value)} />
          </Field>
          <Field label="Item Type">
            <Select options={ITEM_TYPES} value={form.itemType} onChange={(e) => set('itemType', e.target.value)} />
          </Field>
        </div>
        <Field label="Matched Factory (optional)">
          <Select
            placeholder="Leave empty for unmatched…"
            options={[{ id: '', en: '— None —' }, ...verified.map((m) => ({ id: m.id, en: m.name }))]}
            value={form.matchedFactoryId}
            onChange={(e) => set('matchedFactoryId', e.target.value)}
          />
        </Field>
        <Field label="Note">
          <TextInput
            placeholder="Optional note"
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  )
}
