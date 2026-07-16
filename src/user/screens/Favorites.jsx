import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { factoryAvatar } from '../../shared/tokens.js'
import Card from '../../shared/components/Card.jsx'
import { Icon } from '../components/Icon.jsx'

export default function Favorites() {
  const { t, favorites, manufacturers, toggleFavorite } = useApp()
  const navigate = useNavigate()
  const saved = manufacturers.filter((m) => favorites.includes(m.id))

  return (
    <div className="min-h-full">
      <div className="border-b border-line bg-white px-5 pb-4 pt-12">
        <h1 className="text-xl font-bold text-ink">{t('myFavorites')}</h1>
      </div>

      <div className="space-y-3 px-5 py-5">
        {saved.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center text-ink-soft">
            <Icon name="heart" className="h-12 w-12 opacity-40" />
            <p className="mt-3 text-sm">{t('noFavorites')}</p>
          </div>
        )}

        {saved.map((m) => (
          <Card key={m.id} hover className="flex items-center gap-3 p-3">
            <div
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white"
              style={{ backgroundColor: factoryAvatar(m.id) }}
              onClick={() => navigate(`/app/factory/${m.id}`)}
            >
              <Icon name="factory" className="h-7 w-7" />
            </div>
            <div
              className="min-w-0 flex-1"
              onClick={() => navigate(`/app/factory/${m.id}`)}
            >
              <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
              <p className="mt-0.5 truncate text-xs text-ink-soft">
                ⭐ {m.rating} · {m.monthlyCapacity.toLocaleString()} units/mo
              </p>
            </div>
            <button
              onClick={() => toggleFavorite(m.id)}
              className="grid h-9 w-9 place-items-center rounded-full text-danger"
            >
              <Icon name="heart" className="h-5 w-5" filled />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
