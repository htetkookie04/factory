import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import Button from '../../shared/components/Button.jsx'
import OTPInput from '../../shared/components/OTPInput.jsx'
import { Field, TextInput } from '../../shared/components/Field.jsx'
import { Icon } from '../components/Icon.jsx'

// Steps: mode select -> credentials + OTP -> (login: go home) | (register: pick role)
export default function Auth() {
  const { t, setUser, buyers } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('choice') // choice | login | register
  const [step, setStep] = useState('cred') // cred | otp | role
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  function startLogin() {
    // Demo login — match a registered buyer by User ID, else drop in a stub.
    const match = buyers.find((b) => b.userId && b.userId === credential.trim())
    setUser(
      match
        ? { ...match, displayName: match.name }
        : { id: 'BR-000', displayName: credential.trim() || 'Demo Buyer', businessType: 'startup', city: 'Yangon' }
    )
    navigate('/app')
  }

  if (mode === 'choice') {
    return (
      <Shell title={t('appName')} subtitle={t('tagline')}>
        <div className="mt-8 space-y-3">
          <Button full size="lg" onClick={() => { setMode('register'); setStep('cred') }}>
            {t('register')}
          </Button>
          <Button variant="secondary" full size="lg" onClick={() => { setMode('login'); setStep('cred') }}>
            {t('login')}
          </Button>
        </div>
      </Shell>
    )
  }

  if (step === 'cred') {
    // Login: User ID + Password (goes straight in). Register: phone/email -> OTP.
    if (mode === 'login') {
      return (
        <Shell title={t('login')} onBack={() => setMode('choice')}>
          <div className="mt-6 space-y-4">
            <Field label={t('userId')} required>
              <TextInput
                placeholder={t('userIdPlaceholder')}
                autoComplete="username"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
              />
            </Field>
            <Field label={t('password')} required>
              <TextInput
                type="password"
                placeholder={t('passwordPlaceholder')}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button
              full
              size="lg"
              disabled={!credential.trim() || !password}
              iconRight={<Icon name="arrowRight" className="h-5 w-5" />}
              onClick={startLogin}
            >
              {t('login')}
            </Button>
          </div>
        </Shell>
      )
    }

    return (
      <Shell title={t('createAccount')} onBack={() => setMode('choice')}>
        <div className="mt-6 space-y-4">
          <Field label={t('phoneOrEmail')} required>
            <TextInput
              placeholder="09xxxxxxxxx"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
          </Field>
          <Button
            full
            size="lg"
            disabled={!credential.trim()}
            iconRight={<Icon name="arrowRight" className="h-5 w-5" />}
            onClick={() => setStep('otp')}
          >
            {t('continue')}
          </Button>
        </div>
      </Shell>
    )
  }

  if (step === 'otp') {
    return (
      <Shell title={t('enterOtp')} subtitle={t('otpHint')} onBack={() => setStep('cred')}>
        <div className="mt-8">
          <OTPInput value={otp} onChange={setOtp} />
          <Button
            full
            size="lg"
            className="mt-8"
            disabled={otp.length < 6}
            onClick={() => (mode === 'login' ? startLogin() : setStep('role'))}
          >
            {t('verify')}
          </Button>
        </div>
      </Shell>
    )
  }

  // register: choose General Member vs Manufacturer
  return (
    <Shell title={t('iAmA')} onBack={() => setStep('otp')}>
      <div className="mt-6 space-y-3">
        <RoleCard
          icon="user"
          title={t('generalMember')}
          desc={t('generalMemberDesc')}
          onClick={() => navigate('/register')}
        />
        <RoleCard
          icon="factory"
          title={t('manufacturer')}
          desc={t('manufacturerDesc')}
          onClick={() => navigate('/register/manufacturer')}
        />
      </div>
    </Shell>
  )
}

function Shell({ title, subtitle, children, onBack }) {
  return (
    <div className="flex min-h-full flex-col px-6 pb-10 pt-14">
      {onBack && (
        <button onClick={onBack} className="mb-6 grid h-9 w-9 place-items-center rounded-full bg-surface text-ink">
          <Icon name="arrowLeft" className="h-5 w-5" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
      {children}
    </div>
  )
}

function RoleCard({ icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-line bg-white p-4 text-left shadow-soft transition-all hover:border-primary/50 hover:shadow-card"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-xs text-ink-soft">{desc}</span>
      </span>
      <Icon name="arrowRight" className="h-5 w-5 text-ink-soft" />
    </button>
  )
}
