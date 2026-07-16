import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { ITEM_TYPES, factoryAvatar } from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Card from '../../shared/components/Card.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Icon } from '../components/Icon.jsx'

export default function Home() {
  const { t, lang, user, manufacturers } = useApp()
  const navigate = useNavigate()
  const verified = manufacturers.filter((m) => m.status === 'verified')

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="rounded-b-3xl bg-primary px-5 pb-6 pt-12 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">{t('hello')},</p>
            <h1 className="text-xl font-bold">{user?.displayName || 'Guest'} 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/notice')}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15"
              aria-label={t('noticeCenter')}
            >
              <Icon name="bell" className="h-5 w-5" />
            </button>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-lg font-bold">
              {(user?.displayName || 'G').charAt(0)}
            </div>
          </div>
        </div>
        <p className="mt-1 text-sm text-white/80">{t('homeSub')}</p>

        {/* Search bar */}
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-3">
          <Icon name="search" className="h-5 w-5 text-ink-soft" />
          <span className="text-sm text-ink-soft">Search factories, items…</span>
        </div>
      </div>

      <div className="space-y-6 px-5 pt-5">
        {/* AI Sourcing CTA */}
        <button
          onClick={() => navigate('/app/consult')}
          className="flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-primary-light to-mint p-4 text-left text-white shadow-card"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/25">
            <Icon name="sparkles" className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-bold">{t('startAiSourcing')}</span>
            <span className="mt-0.5 block text-xs text-white/90">{t('startAiSourcingDesc')}</span>
          </span>
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>

        {/* Categories */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-ink">{t('browseCategories')}</h2>
          <div className="grid grid-cols-4 gap-3">
            {ITEM_TYPES.map((it) => (
              <button
                key={it.id}
                onClick={() => navigate('/app/consult')}
                className="flex flex-col items-center gap-2"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface text-primary">
                  <Icon name="shirt" className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-medium text-ink-soft">{label(it, lang)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Verified factories */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">{t('verifiedFactories')}</h2>
          </div>
          <div className="space-y-3">
            {verified.slice(0, 3).map((m) => (
              <Card
                key={m.id}
                hover
                className="flex items-center gap-3 p-3"
                onClick={() => navigate(`/app/factory/${m.id}`)}
              >
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white"
                  style={{ backgroundColor: factoryAvatar(m.id) }}
                >
                  <Icon name="factory" className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                    <Icon name="badge" className="h-4 w-4 shrink-0 text-primary" />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">
                    ⭐ {m.rating} · {m.monthlyCapacity.toLocaleString()} units/mo
                  </p>
                </div>
                <StatusBadge tone="success" dot={false}>
                  {t('verified')}
                </StatusBadge>
              </Card>
            ))}
          </div>
        </section>

        {/* Become manufacturer */}
        <button
          onClick={() => navigate('/register/manufacturer')}
          className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-left"
        >
          <Icon name="factory" className="h-6 w-6 text-primary" />
          <span className="flex-1 text-sm font-semibold text-primary">
            {t('becomeManufacturer')}
          </span>
          <Icon name="arrowRight" className="h-5 w-5 text-primary" />
        </button>
      </div>
    </div>
  )
}
