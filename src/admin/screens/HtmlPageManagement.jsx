import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import { Field, TextInput, TextArea } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function HtmlPageManagement() {
  const { htmlPages, addHtmlPage, updateHtmlPage, deleteHtmlPage } = useApp()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null) // page | {} for new
  const [history, setHistory] = useState(null)

  const rows = htmlPages.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()))

  if (editing) {
    return (
      <HtmlEditor
        page={editing}
        onCancel={() => setEditing(null)}
        onSave={(data) => { if (editing.id) updateHtmlPage(editing.id, data); else addHtmlPage(data); setEditing(null) }}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="HTML Pages"
        subtitle="Managed HTML content pages."
        actions={<Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({})}>Register</Button>}
      />

      <Card className="mb-4 p-4">
        <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm">
          <Icon name="search" className="h-4 w-4 text-ink-soft" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search content name…" className="w-full bg-transparent outline-none" />
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-semibold">No.</th>
              <th className="px-4 py-3 font-semibold">Content Name</th>
              <th className="px-4 py-3 font-semibold">Registered By</th>
              <th className="px-4 py-3 font-semibold">Registered At</th>
              <th className="px-4 py-3 text-right font-semibold">Change History</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-soft">No pages.</td></tr>}
            {rows.map((p, i) => (
              <tr key={p.id} className="border-b border-line/70">
                <td className="px-4 py-3 text-ink-soft">{rows.length - i}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setEditing(p)} className="font-medium text-primary hover:underline">{p.title}</button>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.createdBy}</td>
                <td className="px-4 py-3 text-ink-soft">{p.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="secondary" onClick={() => setHistory(p)}>Change History</Button>
                    <IconBtn icon="trash" danger title="Delete" onClick={() => { if (confirm(`Delete "${p.title}"?`)) deleteHtmlPage(p.id) }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!history} onClose={() => setHistory(null)} title={`Change History — ${history?.title || ''}`}>
        {history && (
          <ul className="space-y-2">
            {(history.history || []).map((h, i) => (
              <li key={i} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2 text-sm">
                <span className="text-ink">{h.by}</span>
                <span className="text-ink-soft">{h.date}</span>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}

/* ---------- Full-page editor ---------- */
function HtmlEditor({ page, onCancel, onSave }) {
  const [title, setTitle] = useState(page.title || '')
  const [content, setContent] = useState(page.content || '')
  const [preview, setPreview] = useState(false)

  return (
    <div>
      <PageHeader title="HTML Pages" subtitle={page.id ? 'Edit content' : 'New content'} />

      <Card className="mb-4 p-5">
        <h2 className="mb-3 font-bold text-ink">Content Info</h2>
        <Field label="Content Name" required>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter content name" />
        </Field>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">HTML Content</span>
            <button onClick={() => setPreview((v) => !v)} className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Icon name="search" className="h-4 w-4" /> {preview ? 'Edit source' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[240px] rounded-2xl border border-line bg-white p-4 prose-sm" dangerouslySetInnerHTML={{ __html: content || '<p class="text-ink-soft">Nothing to preview</p>' }} />
          ) : (
            <TextArea rows={12} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter HTML content, e.g. <h1>Title</h1><p>Body…</p>" className="font-mono text-xs" />
          )}
        </div>
      </Card>

      {/* Mock upload sections (no backend) */}
      <UploadSection title="Image Upload" empty="No images registered." action="Add Image" />
      <UploadSection title="Download File Upload" empty="No files registered." action="Add File" />

      <div className="mt-5 flex items-center justify-between">
        <Button variant="subtle" onClick={() => setPreview((v) => !v)}>Preview</Button>
        <div className="flex gap-2">
          <Button variant="subtle" onClick={onCancel}>Cancel</Button>
          <Button disabled={!title.trim()} onClick={() => onSave({ title, content })}>Save</Button>
        </div>
      </div>
    </div>
  )
}

function UploadSection({ title, empty, action }) {
  return (
    <Card className="mb-4 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-ink">{title}</h2>
        <Button size="sm" variant="secondary">{action}</Button>
      </div>
      <div className="rounded-xl border border-line">
        <div className="grid grid-cols-4 border-b border-line px-4 py-2.5 text-xs font-semibold uppercase text-ink-soft">
          <span>No.</span><span className="col-span-2">Name</span><span className="text-right">Registered</span>
        </div>
        <p className="px-4 py-8 text-center text-sm text-ink-soft">{empty}</p>
      </div>
    </Card>
  )
}

function IconBtn({ icon, onClick, danger, title }) {
  return <button title={title} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-surface ${danger ? 'text-danger' : 'text-ink-soft'}`}><Icon name={icon} className="h-4 w-4" /></button>
}
