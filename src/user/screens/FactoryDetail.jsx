import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { FABRIC_TYPES, ITEM_TYPES, REGIONS, YANGON_ZONES, factoryAvatar, factoryCoords } from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Button from '../../shared/components/Button.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import ConsultationBookingModal from '../components/ConsultationBookingModal.jsx'
import { Icon } from '../components/Icon.jsx'

function names(ids, lang, source) {
  return ids.map((id) => label(source.find((o) => o.id === id), lang)).filter(Boolean)
}

export default function FactoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang, factoryById, favorites, toggleFavorite } = useApp()
  const m = factoryById(id)
  const [book, setBook] = useState(false)

  if (!m) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6">
        <p className="text-ink-soft">Factory not found.</p>
        <Button onClick={() => navigate('/app')}>{t('backToHome')}</Button>
      </div>
    )
  }

  const region = REGIONS.find((r) => r.id === m.region)
  const zone = YANGON_ZONES.find((z) => z.id === m.zone)
  const isFav = favorites.includes(m.id)

  return (
    <div className="min-h-full pb-28">
      {/* Hero */}
      <div className="relative px-5 pb-6 pt-12 text-white" style={{ backgroundColor: factoryAvatar(m.id) }}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/20"
          >
            <Icon name="arrowLeft" className="h-5 w-5" />
          </button>
          <button
            onClick={() => toggleFavorite(m.id)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/20"
          >
            <Icon name="heart" className="h-5 w-5" filled={isFav} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20">
            <Icon name="factory" className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold">{m.name}</h1>
              <Icon name="badge" className="h-5 w-5" />
            </div>
            <p className="mt-0.5 text-sm text-white/85">⭐ {m.rating || '—'} · {m.id}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="flex items-center gap-2">
          {m.status === 'verified' ? (
            <StatusBadge tone="success">{t('verified')}</StatusBadge>
          ) : (
            <StatusBadge tone="warning">{t('pendingVerification')}</StatusBadge>
          )}
        </div>

        <Section title={t('location')} icon="location">
          <p className="text-sm text-ink">
            {[m.township, zone && label(zone, lang), region && label(region, lang)]
              .filter(Boolean)
              .join(', ')}
          </p>
          <LocationMap factory={m} label={t('openInMaps')} />
        </Section>

        <Section title={t('capacity')} icon="factory">
          <p className="text-sm text-ink">{m.monthlyCapacity.toLocaleString()} units / month</p>
        </Section>

        <Section title={t('fabrics')} icon="shirt">
          <TagRow tags={names(m.fabrics, lang, FABRIC_TYPES)} />
        </Section>

        <Section title={t('items')} icon="shirt">
          <TagRow tags={names(m.items, lang, ITEM_TYPES)} />
        </Section>

        <Section title={t('clients')} icon="user">
          <TagRow tags={m.clients} />
        </Section>

        {m.certifications?.length > 0 && (
          <Section title={t('certifications')} icon="badge">
            <TagRow tags={m.certifications} />
          </Section>
        )}

        {/* Gallery placeholder */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: m.photos || 3 }).map((_, i) => (
            <div
              key={i}
              className="grid aspect-square place-items-center rounded-xl bg-surface text-ink-soft/40"
            >
              <Icon name="factory" className="h-7 w-7" />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-phone border-t border-line bg-white px-5 py-3 sm:mb-4 sm:rounded-b-[28px]">
        <Button full size="lg" onClick={() => setBook(true)}>
          {t('bookConsultation')}
        </Button>
      </div>

      <ConsultationBookingModal
        open={book}
        factory={{ ...m, matchScore: m.matchScore || 85 }}
        answers={{ fabricType: m.fabrics[0], itemType: m.items[0], location: m.zone || m.region }}
        onClose={() => setBook(false)}
        onBooked={() => navigate('/app/bookings')}
      />
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <Icon name={icon} className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-bold uppercase tracking-wide text-ink-soft">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function TagRow({ tags }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

// Interactive map via OpenStreetMap embed (no API key / backend required).
function LocationMap({ factory, label }) {
  const { lat, lng } = factoryCoords(factory)
  const d = 0.02
  const bbox = `${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
  const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`

  return (
    <div className="mt-3">
      <div className="overflow-hidden rounded-2xl border border-line">
        <iframe
          title={`Map — ${factory.name}`}
          src={src}
          loading="lazy"
          className="h-44 w-full"
          style={{ border: 0 }}
        />
      </div>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
      >
        <Icon name="location" className="h-4 w-4" />
        {label}
      </a>
    </div>
  )
}
