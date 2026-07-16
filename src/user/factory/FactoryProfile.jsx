import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import {
  FABRIC_TYPES,
  ITEM_TYPES,
  MANUFACTURER_STATUS,
} from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { ChipGroup } from '../../shared/components/Chip.jsx'
import TagInput from '../../shared/components/TagInput.jsx'
import { Field, TextInput } from '../../shared/components/Field.jsx'
import { Icon } from '../components/Icon.jsx'

// Combines the Profile Editor (B3) and Verification Status (B4).
export default function FactoryProfile({ factory }) {
  const { t, lang, setLang, updateManufacturer, setUser } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: factory.name,
    monthlyCapacity: factory.monthlyCapacity,
    fabrics: factory.fabrics || [],
    items: factory.items || [],
    clients: factory.clients || [],
  })
  const [toast, setToast] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const st = MANUFACTURER_STATUS[factory.status]

  function save() {
    updateManufacturer(factory.id, {
      name: form.name,
      monthlyCapacity: Number(form.monthlyCapacity) || 0,
      fabrics: form.fabrics,
      items: form.items,
      clients: form.clients,
    })
    setToast(t('profileUpdated'))
    setTimeout(() => setToast(''), 3000)
  }

  const docTone = factory.status === 'verified' ? 'success' : factory.status === 'rejected' ? 'danger' : 'warning'
  const docMsg = factory.status === 'verified' ? t('docApproved') : factory.status === 'rejected' ? t('docRejected') : t('docPending')

  return (
    <div className="min-h-full pb-6">
      <div className="border-b border-line bg-white px-5 pb-4 pt-12">
        <h1 className="text-xl font-bold text-ink">{t('factoryProfile')}</h1>
      </div>

      {toast && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-2xl bg-success/12 px-4 py-3 text-sm font-medium text-success animate-slide-up">
          <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />
          {toast}
        </div>
      )}

      <div className="space-y-4 px-5 py-5">
        {/* Verification status (B4) */}
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{t('verificationStatus')}</span>
            <StatusBadge tone={st.tone}>{label(st, lang)}</StatusBadge>
          </div>
          <p className="text-xs text-ink-soft">{docMsg}</p>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-surface p-3">
            <Icon name="badge" className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{t('registrationDoc')}</p>
              <p className="text-xs text-ink-soft">{factory.regNumber || '—'}</p>
            </div>
            {factory.status === 'rejected' && (
              <Button size="sm" variant="secondary">{t('reupload')}</Button>
            )}
          </div>
        </Card>

        {/* Profile editor (B3) */}
        <Card className="space-y-4 p-4">
          <Field label={t('factoryName')}>
            <TextInput value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label={t('monthlyCapacity')}>
            <TextInput
              type="number"
              value={form.monthlyCapacity}
              onChange={(e) => set('monthlyCapacity', e.target.value)}
            />
          </Field>
          <Field label={t('workableFabrics')}>
            <ChipGroup
              multi
              options={FABRIC_TYPES}
              value={form.fabrics}
              onChange={(v) => set('fabrics', v)}
              getLabel={(o) => label(o, lang)}
            />
          </Field>
          <Field label={t('workableItems')}>
            <ChipGroup
              multi
              options={ITEM_TYPES}
              value={form.items}
              onChange={(v) => set('items', v)}
              getLabel={(o) => label(o, lang)}
            />
          </Field>
          <Field label={t('mainClients')}>
            <TagInput value={form.clients} onChange={(v) => set('clients', v)} />
          </Field>
          <Button full onClick={save}>{t('saveChanges')}</Button>
        </Card>

        {/* Language + session */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="globe" className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-ink">{t('language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[{ id: 'en', label: 'English' }, { id: 'my', label: 'မြန်မာ' }].map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  lang === l.id ? 'border-primary bg-primary/5 text-primary' : 'border-line text-ink-soft'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Card>

        <Button variant="secondary" full onClick={() => navigate('/app')}>
          {t('switchToBuyer')}
        </Button>
        <Button
          variant="danger"
          full
          onClick={() => { setUser(null); navigate('/welcome') }}
        >
          {t('logout')}
        </Button>
      </div>
    </div>
  )
}
