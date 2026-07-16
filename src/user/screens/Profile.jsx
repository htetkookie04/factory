import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { BUSINESS_TYPES } from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import { Icon } from '../components/Icon.jsx'

export default function Profile() {
  const { t, lang, setLang, user, setUser, resetDemoData } = useApp()
  const navigate = useNavigate()
  const bt = BUSINESS_TYPES.find((b) => b.id === user?.businessType)

  return (
    <div className="min-h-full">
      <div className="rounded-b-3xl bg-primary px-5 pb-6 pt-12 text-white">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-2xl font-bold">
            {(user?.displayName || 'G').charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.displayName || 'Guest'}</h1>
            <p className="text-sm text-white/80">{bt ? label(bt, lang) : t('generalMember')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {/* Language toggle */}
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="globe" className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-ink">{t('language')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'en', label: 'English' },
              { id: 'my', label: 'မြန်မာ' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  lang === l.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-line text-ink-soft'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Business info */}
        <Card className="divide-y divide-line">
          <Row icon="user" label={t('contactPerson')} value={user?.contactPerson || '—'} />
          <Row icon="location" label={t('city')} value={user?.city || '—'} />
          <Row icon="chat" label={t('phone')} value={user?.phone || '—'} />
        </Card>

        <button
          onClick={() => navigate('/app/notice')}
          className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-soft transition-all hover:border-primary/40"
        >
          <Icon name="bell" className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm font-semibold text-ink">{t('noticeCenter')}</span>
          <Icon name="arrowRight" className="h-5 w-5 text-ink-soft" />
        </button>

        <Button variant="secondary" full onClick={() => navigate('/register')}>
          {t('editBusinessInfo')}
        </Button>

        <Button variant="subtle" full onClick={() => navigate('/register/manufacturer')}>
          {t('becomeManufacturer')}
        </Button>

        <button
          onClick={() => { resetDemoData() }}
          className="w-full py-2 text-center text-xs text-ink-soft underline"
        >
          Reset demo data
        </button>

        <Button
          variant="danger"
          full
          onClick={() => {
            setUser(null)
            navigate('/welcome')
          }}
        >
          {t('logout')}
        </Button>
      </div>
    </div>
  )
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon name={icon} className="h-5 w-5 text-ink-soft" />
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="ml-auto text-sm font-medium text-ink">{value}</span>
    </div>
  )
}
