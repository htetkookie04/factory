import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput, TextArea } from '../../shared/components/Field.jsx'
import { Icon } from '../components/Icon.jsx'

const TABS = [
  { id: 'noti', icon: 'bell', key: 'notifications' },
  { id: 'faq', icon: 'help', key: 'faq' },
  { id: 'inquiry', icon: 'chat', key: 'oneToOne' },
]

// User-facing Notice Center: Notifications, FAQ, and 1:1 Inquiry.
export default function Notice() {
  const { t } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('noti')

  return (
    <div className="min-h-full">
      <div className="border-b border-line bg-white px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink"
          >
            <Icon name="arrowLeft" className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-ink">{t('noticeCenter')}</h1>
        </div>

        {/* Tab switcher */}
        <div className="mt-4 flex gap-1 rounded-full bg-surface p-1">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-colors ${
                tab === tb.id ? 'bg-primary text-white shadow-soft' : 'text-ink-soft'
              }`}
            >
              <Icon name={tb.icon} className="h-4 w-4" />
              {t(tb.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-5">
        {tab === 'noti' && <Notifications />}
        {tab === 'faq' && <Faq />}
        {tab === 'inquiry' && <Inquiry />}
      </div>
    </div>
  )
}

function Notifications() {
  const { t, notices } = useApp()
  const sorted = [...notices].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  if (!notices.length) return <Empty icon="bell" text={t('noNotices')} />
  return (
    <div className="space-y-3">
      {sorted.map((n) => (
        <Card key={n.id} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-ink">{n.title}</h3>
            {n.pinned && (
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <Icon name="pin" className="h-3.5 w-3.5" /> {t('pinned')}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-ink-soft">{n.body}</p>
          <p className="mt-2 text-xs text-ink-soft/70">{formatDate(n.date)}</p>
        </Card>
      ))}
    </div>
  )
}

function Faq() {
  const { t, faqs } = useApp()
  const [openId, setOpenId] = useState(null)
  if (!faqs.length) return <Empty icon="help" text={t('noFaqs')} />
  return (
    <div className="space-y-2">
      {faqs.map((f) => {
        const isOpen = openId === f.id
        return (
          <Card key={f.id} className="overflow-hidden">
            <button
              onClick={() => setOpenId(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
              <span className="text-sm font-semibold text-ink">{f.question}</span>
              <Icon
                name="chevronDown"
                className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && <p className="px-4 pb-4 text-sm text-ink-soft">{f.answer}</p>}
          </Card>
        )
      })}
    </div>
  )
}

function Inquiry() {
  const { t, inquiries, user, addInquiry } = useApp()
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')

  const mine = inquiries.filter((q) => !user?.id || q.userId === user.id || q.userId == null)

  function submit() {
    addInquiry({ subject, message })
    setOpen(false)
    setSubject('')
    setMessage('')
    setToast(t('inquirySent'))
    setTimeout(() => setToast(''), 3500)
  }

  return (
    <div>
      <Button
        full
        icon={<Icon name="plus" className="h-5 w-5" />}
        onClick={() => setOpen(true)}
      >
        {t('newInquiry')}
      </Button>

      {toast && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-success/12 px-4 py-3 text-sm font-medium text-success animate-slide-up">
          <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />
          {toast}
        </div>
      )}

      <h2 className="mb-2 mt-5 text-sm font-bold text-ink">{t('myInquiries')}</h2>
      {mine.length === 0 ? (
        <Empty icon="chat" text={t('noInquiries')} />
      ) : (
        <div className="space-y-3">
          {mine.map((q) => (
            <Card key={q.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{q.subject}</span>
                <StatusBadge tone={q.status === 'answered' ? 'success' : 'warning'}>
                  {q.status === 'answered' ? t('answered') : t('open')}
                </StatusBadge>
              </div>
              <p className="mt-1.5 text-sm text-ink-soft">{q.message}</p>
              <p className="mt-1 text-xs text-ink-soft/70">{formatDate(q.date)}</p>
              {q.status === 'answered' && q.reply && (
                <div className="mt-3 rounded-xl bg-primary/5 p-3">
                  <p className="text-xs font-semibold text-primary">{t('coordinatorReply')}</p>
                  <p className="mt-1 text-sm text-ink">{q.reply}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('newInquiry')}
        footer={
          <>
            <Button variant="subtle" onClick={() => setOpen(false)}>{t('cancel')}</Button>
            <Button disabled={!subject.trim() || !message.trim()} onClick={submit}>
              {t('send')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label={t('subject')} required>
            <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Field>
          <Field label={t('message')} required>
            <TextArea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}

function Empty({ icon, text }) {
  return (
    <div className="mt-14 flex flex-col items-center text-center text-ink-soft">
      <Icon name={icon} className="h-12 w-12 opacity-40" />
      <p className="mt-3 text-sm">{text}</p>
    </div>
  )
}
