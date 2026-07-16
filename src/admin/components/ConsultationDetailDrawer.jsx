import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import {
  CONSULT_STATUS,
  AI_REC_STATUS,
  BUSINESS_TYPES,
  FABRIC_TYPES,
  ITEM_TYPES,
  factoryAvatar,
} from '../../shared/tokens.js'
import Drawer from '../../shared/components/Drawer.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import ChatBubble from '../../user/components/ChatBubble.jsx'

const find = (arr, id) => arr.find((o) => o.id === id)?.en || id

export default function ConsultationDetailDrawer({ open, onClose, consultation }) {
  const { manufacturers, factoryById } = useApp()
  if (!consultation) return null
  const c = consultation
  const st = CONSULT_STATUS[c.status]
  const ai = AI_REC_STATUS[c.aiRecStatus]
  const matched = factoryById(c.matchedFactoryId)

  return (
    <Drawer open={open} onClose={onClose} title={`Consultation ${c.orderNo}`} width="max-w-lg">
      <div className="space-y-6">
        {/* Status row */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={st.tone}>{st.en}</StatusBadge>
          <StatusBadge tone={ai.tone}>{ai.en}</StatusBadge>
          <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft">
            {c.source === 'app' ? 'From App' : 'Manual Entry'}
          </span>
        </div>

        {/* Summary grid */}
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface/50 p-4 text-sm">
          <Info label="Applicant" value={c.applicantName} />
          <Info label="Brand Type" value={find(BUSINESS_TYPES, c.brandType)} />
          <Info label="Request Date" value={formatDate(c.requestDate)} />
          <Info label="Preferred Slot" value={c.date ? `${formatDate(c.date)} ${c.time}` : '—'} />
          <Info label="Fabric" value={c.fabricType ? find(FABRIC_TYPES, c.fabricType) : '—'} />
          <Info label="Item" value={c.itemType ? find(ITEM_TYPES, c.itemType) : '—'} />
        </dl>

        {/* Buyer note */}
        {c.note && (
          <Section title="Buyer Note">
            <p className="rounded-2xl bg-surface p-3 text-sm text-ink">“{c.note}”</p>
          </Section>
        )}

        {/* Matched factory */}
        <Section title="Matched Factory">
          {matched ? (
            <div className="flex items-center gap-3 rounded-2xl border border-line p-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-xl text-white"
                style={{ backgroundColor: factoryAvatar(matched.id) }}
              >
                🏭
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{matched.name}</p>
                <p className="text-xs text-ink-soft">
                  {c.matchScore ? `${c.matchScore}% match · ` : ''}{matched.id}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">No factory linked yet.</p>
          )}
        </Section>

        {/* Coordinator notes */}
        {c.coordinatorNotes && (
          <Section title="Coordinator Notes">
            <p className="rounded-2xl bg-primary/5 p-3 text-sm text-ink">{c.coordinatorNotes}</p>
          </Section>
        )}

        {/* Factory note (written by the manufacturer) */}
        {c.factoryNote && (
          <Section title="Factory Note">
            <p className="rounded-2xl bg-surface p-3 text-sm text-ink">{c.factoryNote}</p>
          </Section>
        )}

        {/* AI transcript */}
        <Section title="AI Session Transcript">
          {c.transcript?.length ? (
            <div className="space-y-2 rounded-2xl bg-surface/60 p-3">
              {c.transcript.map((m, i) => (
                <ChatBubble key={i} role={m.role}>
                  {m.text}
                </ChatBubble>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">No transcript (manual entry).</p>
          )}
        </Section>
      </div>
    </Drawer>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">{title}</h4>
      {children}
    </div>
  )
}
