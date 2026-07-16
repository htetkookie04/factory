import { useState, useEffect, useRef } from 'react'
import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput, TextArea } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

const TABS = [
  { id: 'notices', label: 'Notices' },
  { id: 'faq', label: 'FAQ' },
  { id: 'inquiries', label: 'Inquiries' },
]

export default function NoticeboardManagement() {
  const { inquiries } = useApp()
  const [tab, setTab] = useState('notices')
  const openCount = inquiries.filter((q) => q.status === 'open').length

  return (
    <div>
      <PageHeader title="Noticeboard" subtitle="Manage notices, FAQ and buyer inquiries — all visible in the user app." />

      <div className="mb-5 flex gap-2">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === tb.id ? 'bg-primary text-white' : 'bg-white text-ink-soft border border-line'
            }`}
          >
            {tb.label}
            {tb.id === 'inquiries' && openCount > 0 && (
              <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold ${tab === tb.id ? 'bg-white/25 text-white' : 'bg-danger text-white'}`}>
                {openCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'notices' && <NoticesTab />}
      {tab === 'faq' && <FaqTab />}
      {tab === 'inquiries' && <InquiriesTab />}
    </div>
  )
}

/* ---------------- Notices ---------------- */
function NoticesTab() {
  const { notices, addNotice, updateNotice, deleteNotice } = useApp()
  const [editing, setEditing] = useState(null) // notice object or {} for new

  return (
    <div>
      <div className="mb-4">
        <Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({ title: '', body: '', pinned: false })}>
          New Notice
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {notices.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {n.pinned && <Icon name="pin" className="h-4 w-4 text-primary" />}
                <h3 className="font-bold text-ink">{n.title}</h3>
              </div>
              <div className="flex gap-1">
                <IconBtn icon="edit" onClick={() => setEditing(n)} />
                <IconBtn icon="trash" danger onClick={() => deleteNotice(n.id)} />
              </div>
            </div>
            <p className="mt-1.5 text-sm text-ink-soft">{n.body}</p>
            <p className="mt-2 text-xs text-ink-soft/70">{formatDate(n.date)}</p>
          </Card>
        ))}
      </div>

      <NoticeEditor
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => {
          if (editing?.id) updateNotice(editing.id, data)
          else addNotice(data)
          setEditing(null)
        }}
      />
    </div>
  )
}

function NoticeEditor({ editing, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [pinned, setPinned] = useState(false)

  // sync when opened
  useSync(editing, () => {
    setTitle(editing?.title || '')
    setBody(editing?.body || '')
    setPinned(!!editing?.pinned)
  })

  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={editing?.id ? 'Edit Notice' : 'New Notice'}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!title.trim()} onClick={() => onSave({ title, body, pinned })}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title" required>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Body">
          <TextArea rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="h-4 w-4 accent-[#6F4E37]" />
          Pin to top
        </label>
      </div>
    </Modal>
  )
}

/* ---------------- FAQ ---------------- */
function FaqTab() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useApp()
  const [editing, setEditing] = useState(null)

  return (
    <div>
      <div className="mb-4">
        <Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({ question: '', answer: '' })}>
          New FAQ
        </Button>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => (
          <Card key={f.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-ink">{f.question}</h3>
              <div className="flex gap-1">
                <IconBtn icon="edit" onClick={() => setEditing(f)} />
                <IconBtn icon="trash" danger onClick={() => deleteFaq(f.id)} />
              </div>
            </div>
            <p className="mt-1.5 text-sm text-ink-soft">{f.answer}</p>
          </Card>
        ))}
      </div>

      <FaqEditor
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => {
          if (editing?.id) updateFaq(editing.id, data)
          else addFaq(data)
          setEditing(null)
        }}
      />
    </div>
  )
}

function FaqEditor({ editing, onClose, onSave }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  useSync(editing, () => {
    setQuestion(editing?.question || '')
    setAnswer(editing?.answer || '')
  })
  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={editing?.id ? 'Edit FAQ' : 'New FAQ'}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!question.trim()} onClick={() => onSave({ question, answer })}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Question" required>
          <TextInput value={question} onChange={(e) => setQuestion(e.target.value)} />
        </Field>
        <Field label="Answer">
          <TextArea rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </Field>
      </div>
    </Modal>
  )
}

/* ---------------- Inquiries ---------------- */
function InquiriesTab() {
  const { inquiries, replyInquiry } = useApp()
  const [replying, setReplying] = useState(null)
  const [text, setText] = useState('')

  const sorted = [...inquiries].sort((a, b) => (a.status === 'open' ? -1 : 1))

  return (
    <div className="space-y-3">
      {sorted.length === 0 && <p className="text-sm text-ink-soft">No inquiries yet.</p>}
      {sorted.map((q) => (
        <Card key={q.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink">{q.subject}</h3>
                <StatusBadge tone={q.status === 'answered' ? 'success' : 'warning'}>
                  {q.status === 'answered' ? 'Answered' : 'Open'}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{q.message}</p>
              <p className="mt-1 text-xs text-ink-soft/70">{q.userName} · {formatDate(q.date)}</p>
              {q.reply && (
                <div className="mt-2 rounded-xl bg-primary/5 p-3">
                  <p className="text-xs font-semibold text-primary">Coordinator reply</p>
                  <p className="mt-1 text-sm text-ink">{q.reply}</p>
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant={q.status === 'open' ? 'primary' : 'subtle'}
              onClick={() => { setReplying(q); setText(q.reply || '') }}
            >
              {q.status === 'open' ? 'Reply' : 'View'}
            </Button>
          </div>
        </Card>
      ))}

      <Modal
        open={!!replying}
        onClose={() => setReplying(null)}
        title="Reply to Inquiry"
        footer={
          <>
            <Button variant="subtle" onClick={() => setReplying(null)}>Cancel</Button>
            <Button disabled={!text.trim()} onClick={() => { replyInquiry(replying.id, text); setReplying(null) }}>
              Send Reply
            </Button>
          </>
        }
      >
        {replying && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-surface p-3">
              <p className="text-sm font-semibold text-ink">{replying.subject}</p>
              <p className="mt-1 text-sm text-ink-soft">{replying.message}</p>
              <p className="mt-1 text-xs text-ink-soft/70">{replying.userName}</p>
            </div>
            <Field label="Your reply" required>
              <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ---------------- helpers ---------------- */
function IconBtn({ icon, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-surface ${danger ? 'text-danger' : 'text-ink-soft'}`}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )
}

// Re-run a setter effect whenever the editing target identity changes.
function useSync(editing, fn) {
  const ref = useRef(fn)
  ref.current = fn
  const key = editing ? editing.id || 'new' : null
  useEffect(() => {
    if (editing) ref.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, editing])
}
