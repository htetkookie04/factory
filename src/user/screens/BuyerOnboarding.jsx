import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { BUSINESS_TYPES } from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Button from '../../shared/components/Button.jsx'
import StepProgressBar from '../../shared/components/StepProgressBar.jsx'
import { ChipGroup } from '../../shared/components/Chip.jsx'
import { Field, TextInput, Select } from '../../shared/components/Field.jsx'
import { Icon } from '../components/Icon.jsx'

const CITIES = [
  { id: 'Yangon', en: 'Yangon' },
  { id: 'Mandalay', en: 'Mandalay' },
  { id: 'Nay Pyi Taw', en: 'Nay Pyi Taw' },
  { id: 'Bago', en: 'Bago' },
  { id: 'Other', en: 'Other' },
]

export default function BuyerOnboarding() {
  const { t, lang, setUser, setBuyers, buyers } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    displayName: '',
    businessType: '',
    userId: '',
    password: '',
    confirmPassword: '',
    contactPerson: '',
    city: 'Yangon',
    phone: '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const pwTooShort = form.password.length > 0 && form.password.length < 6
  const pwMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword

  const canNext = [
    form.displayName.trim() &&
      form.businessType &&
      form.userId.trim() &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword,
    true, // logo optional
    form.contactPerson.trim(),
  ]

  function finish() {
    const id = `BR-${String(buyers.length + 1).padStart(3, '0')}`
    const record = {
      id,
      name: form.displayName,
      businessType: form.businessType,
      userId: form.userId,
      city: form.city,
      contactPerson: form.contactPerson,
      phone: form.phone,
    }
    setBuyers((prev) => [record, ...prev])
    setUser({ ...record, displayName: form.displayName })
    setStep(3) // success
  }

  if (step === 3) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 pb-10 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
          <Icon name="check" className="h-10 w-10" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-ink">{t('accountReady')}</h1>
        <p className="mt-2 text-sm text-ink-soft">{t('accountReadyDesc')}</p>
        <Button full size="lg" className="mt-8" onClick={() => navigate('/app')}>
          {t('getStarted')}
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

      <StepProgressBar total={3} current={step} />

      <h1 className="mt-6 text-2xl font-bold text-ink">{t('businessProfile')}</h1>

      <div className="mt-6 flex-1 space-y-5">
        {step === 0 && (
          <>
            <Field label={t('displayName')} required>
              <TextInput
                placeholder="e.g. Aurora Apparel"
                value={form.displayName}
                onChange={(e) => set('displayName', e.target.value)}
              />
            </Field>
            <Field label={t('businessType')} required>
              <ChipGroup
                options={BUSINESS_TYPES}
                value={form.businessType}
                onChange={(v) => set('businessType', v)}
                getLabel={(o) => label(o, lang)}
              />
            </Field>
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
          <Field label={t('companyLogo')}>
            <button className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-surface py-10 text-ink-soft transition-colors hover:border-primary/40">
              <Icon name="plus" className="h-7 w-7" />
              <span className="text-sm font-medium">Upload logo (optional)</span>
            </button>
          </Field>
        )}

        {step === 2 && (
          <>
            <Field label={t('contactPerson')} required>
              <TextInput
                placeholder="Full name"
                value={form.contactPerson}
                onChange={(e) => set('contactPerson', e.target.value)}
              />
            </Field>
            <Field label={t('phone')}>
              <TextInput
                placeholder="+95 9 ..."
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>
            <Field label={t('city')}>
              <Select
                options={CITIES}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </Field>
          </>
        )}
      </div>

      <Button
        full
        size="lg"
        disabled={!canNext[step]}
        iconRight={<Icon name="arrowRight" className="h-5 w-5" />}
        onClick={() => (step === 2 ? finish() : setStep(step + 1))}
      >
        {step === 2 ? t('submit') : t('next')}
      </Button>
    </div>
  )
}
