import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import Button from '../../shared/components/Button.jsx'
import { Icon } from '../components/Icon.jsx'

export default function Welcome() {
  const { lang, setLang, t, setUser, manufacturers } = useApp()
  const navigate = useNavigate()

  // Instant demo login as an existing verified factory account.
  function enterAsFactory() {
    const demo = manufacturers.find((m) => m.status === 'verified') || manufacturers[0]
    if (!demo) return
    setUser({ id: demo.id, role: 'manufacturer', manufacturerId: demo.id, displayName: demo.name })
    navigate('/factory')
  }

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-primary to-[#3d2a1c] px-6 pb-10 pt-16 text-white">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 backdrop-blur">
          <Icon name="shirt" className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">OVEILE</h1>
        <p className="mt-2 text-sm text-white/80">{t('tagline')}</p>
      </div>

      <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
        <p className="mb-3 text-center text-sm font-medium text-white/90">
          {t('chooseLanguage')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'en', label: 'English' },
            { id: 'my', label: 'မြန်မာ' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`rounded-2xl border py-3 text-sm font-semibold transition-all ${
                lang === l.id
                  ? 'border-white bg-white text-primary'
                  : 'border-white/40 bg-transparent text-white hover:bg-white/10'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <Button
          variant="secondary"
          full
          size="lg"
          className="mt-4 border-white bg-white text-primary hover:bg-white/90"
          iconRight={<Icon name="arrowRight" className="h-5 w-5" />}
          onClick={() => navigate('/auth')}
        >
          {t('continue')}
        </Button>
      </div>

      {/* Demo shortcuts */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button onClick={enterAsFactory} className="text-xs text-white/80 underline">
          {t('enterAsFactory')} →
        </button>
        <button onClick={() => navigate('/admin')} className="text-xs text-white/70 underline">
          Open Admin Console →
        </button>
      </div>
    </div>
  )
}
