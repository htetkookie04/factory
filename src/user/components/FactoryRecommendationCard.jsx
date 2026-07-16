import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { FABRIC_TYPES, ITEM_TYPES, factoryAvatar } from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import { Icon } from './Icon.jsx'

function tagLabel(id, lang) {
  const opt = [...FABRIC_TYPES, ...ITEM_TYPES].find((o) => o.id === id)
  return opt ? label(opt, lang) : id
}

export default function FactoryRecommendationCard({ factory, onBook }) {
  const { t, lang } = useApp()
  const navigate = useNavigate()
  const tags = [...factory.fabrics.slice(0, 2), ...factory.items.slice(0, 1)]

  return (
    <div className="w-64 shrink-0 rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <div
          className="grid h-12 w-12 place-items-center rounded-2xl text-white"
          style={{ backgroundColor: factoryAvatar(factory.id) }}
        >
          <Icon name="factory" className="h-6 w-6" />
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          {factory.matchScore}% {t('match')}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <h3 className="truncate text-sm font-bold text-ink">{factory.name}</h3>
        <Icon name="badge" className="h-4 w-4 shrink-0 text-primary" />
      </div>
      <p className="mt-0.5 text-xs text-ink-soft">
        ⭐ {factory.rating} · {factory.monthlyCapacity.toLocaleString()}/mo
      </p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {tags.map((tg) => (
          <span
            key={tg}
            className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-soft"
          >
            {tagLabel(tg, lang)}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={() => onBook(factory)}
          className="w-full rounded-full bg-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-[#5a3f2c]"
        >
          {t('bookWithThis')}
        </button>
        <button
          onClick={() => navigate(`/app/factory/${factory.id}`)}
          className="w-full rounded-full border border-line py-2 text-xs font-semibold text-primary hover:bg-surface"
        >
          {t('viewProfile')}
        </button>
      </div>
    </div>
  )
}
