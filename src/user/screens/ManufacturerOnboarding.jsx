import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import {
  FABRIC_TYPES,
  ITEM_TYPES,
  REGIONS,
  YANGON_ZONES,
} from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Button from '../../shared/components/Button.jsx'
import StepProgressBar from '../../shared/components/StepProgressBar.jsx'
import { ChipGroup } from '../../shared/components/Chip.jsx'
import TagInput from '../../shared/components/TagInput.jsx'
import {
  Field,
  TextInput,
  Select,
  RadioCardGroup,
} from '../../shared/components/Field.jsx'
import { Icon } from '../components/Icon.jsx'

const STEPS = ['companyInfo', 'address', 'productionCapability', 'clientCredibility', 'reviewSubmit']

const emptyForm = {
  name: '',
  userId: '',
  password: '',
  confirmPassword: '',
  regStatus: 'registered',
  regNumber: '',
  region: 'yangon',
  zone: 'hlaing_tharyar',
  township: '',
  fabrics: [],
  items: [],
  monthlyCapacity: '',
  clients: [],
  certifications: [],
  photos: 3,
}

export default function ManufacturerOnboarding() {
  const { t, lang, addManufacturer, setUser } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [done, setDone] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const pwTooShort = form.password.length > 0 && form.password.length < 6
  const pwMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword

  const stepValid = [
    form.name.trim() &&
      (form.regStatus !== 'registered' || form.regNumber.trim()) &&
      form.userId.trim() &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword,
    form.township.trim(),
    form.fabrics.length && form.items.length && String(form.monthlyCapacity).trim(),
    true,
    true,
  ]

  function submit() {
    const rec = addManufacturer({
      name: form.name,
      userId: form.userId,
      status: 'pending',
      region: form.region,
      zone: form.region === 'yangon' ? form.zone : null,
      township: form.township,
      regStatus: form.regStatus,
      regNumber: form.regNumber,
      fabrics: form.fabrics,
      items: form.items,
      monthlyCapacity: Number(form.monthlyCapacity) || 0,
      clients: form.clients,
      certifications: form.certifications,
      photos: form.photos,
    })
    // Create a manufacturer account session linked to this factory record.
    setUser({
      id: rec.id,
      role: 'manufacturer',
      manufacturerId: rec.id,
      displayName: rec.name,
      userId: form.userId,
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 pb-10 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-warning/15 text-warning">
          <Icon name="clock" className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-ink">{t('pendingVerification')}</h1>
        <p className="mt-2 text-sm text-ink-soft">{t('pendingVerificationDesc')}</p>
        <Button full size="lg" className="mt-8" onClick={() => navigate('/factory')}>
          {t('goToDashboard')}
        </Button>
        <Button variant="ghost" className="mt-2" onClick={() => navigate('/app')}>
          {t('backToHome')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col px-6 pb-10 pt-14">
      <button
        onClick={() => (step === 0 ? navigate('/auth') : setStep(step - 1))}
        className="mb-5 grid h-9 w-9 place-items-center rounded-full bg-surface text-ink"
      >
        <Icon name="arrowLeft" className="h-5 w-5" />
      </button>

      <StepProgressBar total={5} current={step} />
      <h1 className="mt-6 text-2xl font-bold text-ink">{t(STEPS[step])}</h1>

      <div className="mt-6 flex-1 space-y-5">
        {step === 0 && (
          <>
            <Field label={t('factoryName')} required>
              <TextInput
                placeholder="e.g. Shwe Thread Garment Co."
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </Field>
            <Field label={t('regStatus')} required>
              <RadioCardGroup
                value={form.regStatus}
                onChange={(v) => set('regStatus', v)}
                options={[
                  { value: 'registered', label: t('registered') },
                  { value: 'pending', label: t('pending') },
                  { value: 'unregistered', label: t('unregistered') },
                ]}
              />
            </Field>
            {form.regStatus === 'registered' && (
              <Field label={t('regNumber')} required>
                <TextInput
                  placeholder="e.g. YGN-114/2019"
                  value={form.regNumber}
                  onChange={(e) => set('regNumber', e.target.value)}
                />
              </Field>
            )}
            <Field label={t('userId')} required>
              <TextInput
                placeholder={t('userIdPlaceholder')}
                autoComplete="username"
                value={form.userId}
                onChange={(e) => set('userId', e.target.value)}
              />
            </Field>
            <Field label={t('password')} required>
              <TextInput
                type="password"
                placeholder={t('passwordPlaceholder')}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />
              {pwTooShort && (
                <span className="mt-1 block text-xs text-danger">{t('passwordTooShort')}</span>
              )}
            </Field>
            <Field label={t('confirmPassword')} required>
              <TextInput
                type="password"
                placeholder={t('passwordPlaceholder')}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
              />
              {pwMismatch && (
                <span className="mt-1 block text-xs text-danger">{t('passwordMismatch')}</span>
              )}
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label={t('region')} required>
              <Select
                options={REGIONS.map((r) => ({ id: r.id, en: label(r, lang) }))}
                value={form.region}
                onChange={(e) => set('region', e.target.value)}
              />
            </Field>
            {form.region === 'yangon' && (
              <Field label={t('industrialZone')} required>
                <Select
                  options={YANGON_ZONES.map((z) => ({ id: z.id, en: label(z, lang) }))}
                  value={form.zone}
                  onChange={(e) => set('zone', e.target.value)}
                />
              </Field>
            )}
            <Field label={t('township')} required>
              <TextInput
                placeholder="Township / Street"
                value={form.township}
                onChange={(e) => set('township', e.target.value)}
              />
            </Field>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface py-3 text-sm font-medium text-ink-soft">
              <Icon name="location" className="h-5 w-5" /> {t('setOnMap')}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <Field label={t('workableFabrics')} required>
              <ChipGroup
                multi
                options={FABRIC_TYPES}
                value={form.fabrics}
                onChange={(v) => set('fabrics', v)}
                getLabel={(o) => label(o, lang)}
              />
            </Field>
            <Field label={t('workableItems')} required>
              <ChipGroup
                multi
                options={ITEM_TYPES}
                value={form.items}
                onChange={(v) => set('items', v)}
                getLabel={(o) => label(o, lang)}
              />
            </Field>
            <Field label={t('monthlyCapacity')} required>
              <TextInput
                type="number"
                min="0"
                placeholder="e.g. 45000"
                value={form.monthlyCapacity}
                onChange={(e) => set('monthlyCapacity', e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label={t('mainClients')} hint={t('mainClientsHint')}>
              <TagInput
                value={form.clients}
                onChange={(v) => set('clients', v)}
                placeholder="e.g. H&M, Uniqlo"
              />
            </Field>
            <Field label={t('certifications')}>
              <div className="flex flex-wrap gap-2">
                {['WRAP', 'ISO 9001', 'BSCI', 'ISO 14001'].map((cert) => {
                  const active = form.certifications.includes(cert)
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() =>
                        set(
                          'certifications',
                          active
                            ? form.certifications.filter((c) => c !== cert)
                            : [...form.certifications, cert]
                        )
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? 'border-primary bg-primary text-white'
                          : 'border-line bg-white text-ink-soft'
                      }`}
                    >
                      {cert}
                    </button>
                  )
                })}
              </div>
            </Field>
            <Field label={t('factoryPhotos')}>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid aspect-square place-items-center rounded-xl bg-surface text-ink-soft/40"
                  >
                    <Icon name="factory" className="h-7 w-7" />
                  </div>
                ))}
                <button className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-line text-ink-soft">
                  <Icon name="plus" className="h-6 w-6" />
                </button>
              </div>
            </Field>
          </>
        )}

        {step === 4 && (
          <ReviewSummary form={form} lang={lang} t={t} onEdit={setStep} />
        )}
      </div>

      <Button
        full
        size="lg"
        disabled={!stepValid[step]}
        iconRight={step < 4 ? <Icon name="arrowRight" className="h-5 w-5" /> : null}
        onClick={() => (step === 4 ? submit() : setStep(step + 1))}
      >
        {step === 4 ? t('submit') : t('next')}
      </Button>
    </div>
  )
}

function ReviewSummary({ form, lang, t, onEdit }) {
  const rows = [
    {
      step: 0,
      title: t('companyInfo'),
      items: [
        [t('factoryName'), form.name],
        [t('regStatus'), t(form.regStatus)],
        form.regStatus === 'registered' && [t('regNumber'), form.regNumber],
      ].filter(Boolean),
    },
    {
      step: 1,
      title: t('address'),
      items: [
        [t('region'), label(REGIONS.find((r) => r.id === form.region), lang)],
        form.region === 'yangon' && [
          t('industrialZone'),
          label(YANGON_ZONES.find((z) => z.id === form.zone), lang),
        ],
        [t('township'), form.township],
      ].filter(Boolean),
    },
    {
      step: 2,
      title: t('productionCapability'),
      items: [
        [t('fabrics'), form.fabrics.map((id) => label(FABRIC_TYPES.find((f) => f.id === id), lang)).join(', ')],
        [t('items'), form.items.map((id) => label(ITEM_TYPES.find((i) => i.id === id), lang)).join(', ')],
        [t('monthlyCapacity'), form.monthlyCapacity],
      ],
    },
    {
      step: 3,
      title: t('clientCredibility'),
      items: [
        [t('mainClients'), form.clients.join(', ') || '—'],
        [t('certifications'), form.certifications.join(', ') || '—'],
      ],
    },
  ]

  return (
    <div className="space-y-3">
      {rows.map((section) => (
        <div key={section.title} className="rounded-2xl border border-line bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">{section.title}</h3>
            <button
              onClick={() => onEdit(section.step)}
              className="text-xs font-semibold text-primary"
            >
              {t('edit')}
            </button>
          </div>
          <dl className="space-y-1">
            {section.items.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 text-sm">
                <dt className="text-ink-soft">{k}</dt>
                <dd className="text-right font-medium text-ink">{v || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}
