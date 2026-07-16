import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import { FABRIC_TYPES, ITEM_TYPES } from '../../shared/tokens.js'
import { matchFactories } from '../../shared/mockData.js'
import { label } from '../../shared/i18n.js'
import ChatBubble from '../components/ChatBubble.jsx'
import FactoryRecommendationCard from '../components/FactoryRecommendationCard.jsx'
import ConsultationBookingModal from '../components/ConsultationBookingModal.jsx'
import { ChipGroup } from '../../shared/components/Chip.jsx'
import { Icon } from '../components/Icon.jsx'

const LOCATIONS = [
  { id: 'hlaing_tharyar', en: 'Yangon · Hlaing Tharyar', my: 'ရန်ကုန် · လှိုင်သာယာ', region: 'yangon' },
  { id: 'shwe_pyi_thar', en: 'Yangon · Shwe Pyi Thar', my: 'ရန်ကုန် · ရွှေပြည်သာ', region: 'yangon' },
  { id: 'south_dagon', en: 'Yangon · South Dagon', my: 'ရန်ကုန် · တောင်ဒဂုံ', region: 'yangon' },
  { id: 'mandalay', en: 'Mandalay', my: 'မန္တလေး', region: 'mandalay' },
  { id: 'any', en: 'Any location', my: 'နေရာမရွေး', region: 'any' },
]

// Guided steps: fabric -> item -> location -> results -> follow-up
export default function AIConsult() {
  const { t, lang, manufacturers } = useApp()
  const [answers, setAnswers] = useState({ fabricType: '', itemType: '', location: '' })
  const [phase, setPhase] = useState('fabric') // fabric | item | location | thinking | results
  const [bookFactory, setBookFactory] = useState(null)
  const [confirmedMsg, setConfirmedMsg] = useState('')
  const scrollRef = useRef(null)

  const results = useMemo(() => {
    if (phase !== 'results') return []
    const region = LOCATIONS.find((l) => l.id === answers.location)?.region || 'any'
    return matchFactories(
      { fabricType: answers.fabricType, itemType: answers.itemType, location: region },
      manufacturers
    )
  }, [phase, answers, manufacturers])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [phase])

  function answer(key, value, nextPhase) {
    setAnswers((a) => ({ ...a, [key]: value }))
    if (nextPhase === 'thinking') {
      setPhase('thinking')
      setTimeout(() => setPhase('results'), 1200)
    } else {
      setPhase(nextPhase)
    }
  }

  const transcript = [
    { role: 'ai', text: t('aiWelcome') },
    answers.fabricType && { role: 'user', text: `${t('fabrics')}: ${label(FABRIC_TYPES.find((f) => f.id === answers.fabricType), lang)}` },
    answers.itemType && { role: 'user', text: `${t('items')}: ${label(ITEM_TYPES.find((i) => i.id === answers.itemType), lang)}` },
    answers.location && { role: 'user', text: `${t('location')}: ${label(LOCATIONS.find((l) => l.id === answers.location), lang)}` },
  ].filter(Boolean)

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-white px-4 pb-3 pt-12">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon name="sparkles" className="h-5 w-5" />
          </span>
          <h1 className="text-base font-bold text-ink">{t('aiTitle')}</h1>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface">
          <Icon name="history" className="h-5 w-5" />
        </button>
      </div>

      {/* Thread */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface/50 px-4 py-4 no-scrollbar">
        <ChatBubble role="ai">{t('aiWelcome')}</ChatBubble>

        {/* Step 1: Fabric */}
        <StepBlock
          show
          question={t('qFabric')}
          answered={!!answers.fabricType}
          answerText={answers.fabricType && label(FABRIC_TYPES.find((f) => f.id === answers.fabricType), lang)}
        >
          <InlineChipForm
            options={FABRIC_TYPES}
            lang={lang}
            onSelect={(v) => answer('fabricType', v, 'item')}
          />
        </StepBlock>

        {/* Step 2: Item */}
        {answers.fabricType && (
          <StepBlock
            show
            question={t('qItem')}
            answered={!!answers.itemType}
            answerText={answers.itemType && label(ITEM_TYPES.find((i) => i.id === answers.itemType), lang)}
          >
            <InlineChipForm
              options={ITEM_TYPES}
              lang={lang}
              onSelect={(v) => answer('itemType', v, 'location')}
            />
          </StepBlock>
        )}

        {/* Step 3: Location */}
        {answers.itemType && (
          <StepBlock
            show
            question={t('qLocation')}
            answered={!!answers.location}
            answerText={answers.location && label(LOCATIONS.find((l) => l.id === answers.location), lang)}
          >
            <InlineChipForm
              options={LOCATIONS}
              lang={lang}
              onSelect={(v) => answer('location', v, 'thinking')}
            />
          </StepBlock>
        )}

        {/* Thinking */}
        {phase === 'thinking' && (
          <ChatBubble role="ai">
            <span className="flex items-center gap-2">
              <Dots /> {t('aiThinking')}
            </span>
          </ChatBubble>
        )}

        {/* Results */}
        {phase === 'results' && (
          <>
            <ChatBubble role="ai">{t('aiResults')}</ChatBubble>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
              {results.map((f) => (
                <FactoryRecommendationCard key={f.id} factory={f} onBook={setBookFactory} />
              ))}
            </div>
            {confirmedMsg && (
              <ChatBubble role="ai">
                ✅ {confirmedMsg}
              </ChatBubble>
            )}
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-line bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-surface px-4 py-2.5">
            <input
              disabled={phase !== 'results'}
              placeholder={phase === 'results' ? t('followUpPlaceholder') : t('guidedLocked')}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-soft/70 disabled:cursor-not-allowed"
            />
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon name="mic" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ConsultationBookingModal
        open={!!bookFactory}
        factory={bookFactory}
        answers={{ ...answers, transcript }}
        onClose={() => setBookFactory(null)}
        onBooked={(rec) => setConfirmedMsg(`${t('bookingCreated')} (${rec.orderNo})`)}
      />
    </div>
  )
}

function StepBlock({ question, children, answered, answerText }) {
  return (
    <div className="space-y-2">
      <ChatBubble role="ai">{question}</ChatBubble>
      {answered ? (
        <ChatBubble role="user">{answerText}</ChatBubble>
      ) : (
        <div className="rounded-2xl border border-line bg-white p-3">{children}</div>
      )}
    </div>
  )
}

function InlineChipForm({ options, lang, onSelect }) {
  return (
    <ChipGroup
      options={options}
      value={null}
      onChange={onSelect}
      getLabel={(o) => label(o, lang)}
    />
  )
}

function Dots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
