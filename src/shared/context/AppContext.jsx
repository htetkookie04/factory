import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  seedConsultations,
  seedManufacturers,
  seedBuyers,
  seedNotices,
  seedFaqs,
  seedInquiries,
  seedAdmins,
  seedCodeGroups,
  seedMenus,
  seedMenuPermissions,
  seedBanners,
  seedPopups,
  seedHtmlPages,
} from '../mockData.js'
import { makeT } from '../i18n.js'

const AppContext = createContext(null)

const LS_KEYS = {
  consultations: 'oveile.consultations',
  manufacturers: 'oveile.manufacturers',
  buyers: 'oveile.buyers',
  favorites: 'oveile.favorites',
  lang: 'oveile.lang',
  user: 'oveile.user',
  notices: 'oveile.notices',
  faqs: 'oveile.faqs',
  inquiries: 'oveile.inquiries',
  admins: 'oveile.admins',
  codeGroups: 'oveile.codeGroups',
  menus: 'oveile.menus',
  adminRole: 'oveile.adminRole',
  menuPermissions: 'oveile.menuPermissions',
  banners: 'oveile.banners',
  popups: 'oveile.popups',
  htmlPages: 'oveile.htmlPages',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [consultations, setConsultations] = useState(() =>
    load(LS_KEYS.consultations, seedConsultations)
  )
  const [manufacturers, setManufacturers] = useState(() =>
    load(LS_KEYS.manufacturers, seedManufacturers)
  )
  const [buyers, setBuyers] = useState(() => load(LS_KEYS.buyers, seedBuyers))
  const [favorites, setFavorites] = useState(() => load(LS_KEYS.favorites, []))
  const [lang, setLang] = useState(() => load(LS_KEYS.lang, 'en'))
  // Mocked "current user" for the buyer app. Populated on registration.
  const [user, setUser] = useState(() => load(LS_KEYS.user, null))
  // Noticeboard: admin-managed content read by the user app.
  const [notices, setNotices] = useState(() => load(LS_KEYS.notices, seedNotices))
  const [faqs, setFaqs] = useState(() => load(LS_KEYS.faqs, seedFaqs))
  const [inquiries, setInquiries] = useState(() => load(LS_KEYS.inquiries, seedInquiries))
  const [admins, setAdmins] = useState(() => load(LS_KEYS.admins, seedAdmins))
  const [codeGroups, setCodeGroups] = useState(() => load(LS_KEYS.codeGroups, seedCodeGroups))
  const [menus, setMenus] = useState(() => {
    const stored = load(LS_KEYS.menus, null)
    if (!stored) return seedMenus
    // Migration: append any newly-added seed menus missing from stored config,
    // so new console features appear without needing a full data reset.
    const ids = new Set(stored.map((m) => m.id))
    const missing = seedMenus.filter((m) => !ids.has(m.id))
    return missing.length ? [...stored, ...missing] : stored
  })
  // Role the console is currently acting as (drives menu access filtering).
  const [adminRole, setAdminRole] = useState(() => load(LS_KEYS.adminRole, 'super_admin'))
  const [menuPermissions, setMenuPermissions] = useState(() =>
    load(LS_KEYS.menuPermissions, seedMenuPermissions)
  )
  const [banners, setBanners] = useState(() => load(LS_KEYS.banners, seedBanners))
  const [popups, setPopups] = useState(() => load(LS_KEYS.popups, seedPopups))
  const [htmlPages, setHtmlPages] = useState(() => load(LS_KEYS.htmlPages, seedHtmlPages))

  // Persist each slice.
  useEffect(() => {
    localStorage.setItem(LS_KEYS.consultations, JSON.stringify(consultations))
  }, [consultations])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.manufacturers, JSON.stringify(manufacturers))
  }, [manufacturers])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.buyers, JSON.stringify(buyers))
  }, [buyers])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.favorites, JSON.stringify(favorites))
  }, [favorites])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.lang, JSON.stringify(lang))
  }, [lang])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.user, JSON.stringify(user))
  }, [user])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.notices, JSON.stringify(notices))
  }, [notices])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.faqs, JSON.stringify(faqs))
  }, [faqs])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.inquiries, JSON.stringify(inquiries))
  }, [inquiries])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.admins, JSON.stringify(admins))
  }, [admins])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.codeGroups, JSON.stringify(codeGroups))
  }, [codeGroups])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.menus, JSON.stringify(menus))
  }, [menus])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.adminRole, JSON.stringify(adminRole))
  }, [adminRole])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.menuPermissions, JSON.stringify(menuPermissions))
  }, [menuPermissions])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.banners, JSON.stringify(banners))
  }, [banners])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.popups, JSON.stringify(popups))
  }, [popups])
  useEffect(() => {
    localStorage.setItem(LS_KEYS.htmlPages, JSON.stringify(htmlPages))
  }, [htmlPages])

  const t = useMemo(() => makeT(lang), [lang])

  function nextOrderNo() {
    const nums = consultations
      .map((c) => parseInt(String(c.orderNo).replace(/[^0-9]/g, ''), 10))
      .filter((n) => !Number.isNaN(n))
    const max = nums.length ? Math.max(...nums) : 0
    return `ORD-${String(max + 1).padStart(4, '0')}`
  }

  // Core data contract: a buyer booking -> exactly one consultation row.
  function addConsultation(partial) {
    const orderNo = nextOrderNo()
    const record = {
      id: orderNo,
      orderNo,
      requestDate: partial.requestDate || todayISO(),
      applicantName: partial.applicantName || user?.displayName || 'Unknown',
      buyerId: partial.buyerId ?? user?.id ?? null,
      brandType: partial.brandType || user?.businessType || 'startup',
      fabricType: partial.fabricType || null,
      itemType: partial.itemType || null,
      location: partial.location || null,
      aiRecStatus: partial.aiRecStatus || 'recommended',
      status: partial.status || 'requested',
      matchedFactoryId: partial.matchedFactoryId ?? null,
      matchScore: partial.matchScore ?? 0,
      note: partial.note || '',
      coordinatorNotes: partial.coordinatorNotes || '',
      factoryNote: partial.factoryNote || '',
      date: partial.date || '',
      time: partial.time || '',
      source: partial.source || 'app',
      transcript: partial.transcript || [],
    }
    setConsultations((prev) => [record, ...prev])
    return record
  }

  function updateConsultation(id, patch) {
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    )
  }

  function addManufacturer(partial) {
    const id = `MF-${String(manufacturers.length + 1).padStart(3, '0')}`
    const record = { id, status: 'pending', rating: 0, color: '#A07C5B', ...partial }
    setManufacturers((prev) => [record, ...prev])
    return record
  }

  function updateManufacturer(id, patch) {
    setManufacturers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    )
  }

  function deleteManufacturer(id) {
    setManufacturers((prev) => prev.filter((m) => m.id !== id))
  }

  // ---- Buyer account management (admin) ----
  function addBuyer(partial) {
    const nums = buyers
      .map((b) => parseInt(String(b.id).replace(/[^0-9]/g, ''), 10))
      .filter((n) => !Number.isNaN(n))
    const id = `BR-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')}`
    const record = { id, status: 'active', ...partial }
    setBuyers((prev) => [record, ...prev])
    return record
  }
  const updateBuyer = (id, patch) =>
    setBuyers((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  const deleteBuyer = (id) => setBuyers((prev) => prev.filter((b) => b.id !== id))

  // ---- Admin account management ----
  function addAdmin(partial) {
    const nums = admins
      .map((a) => parseInt(String(a.id).replace(/[^0-9]/g, ''), 10))
      .filter((n) => !Number.isNaN(n))
    const id = `AD-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')}`
    const record = { id, status: 'active', role: 'coordinator', ...partial }
    setAdmins((prev) => [...prev, record])
    return record
  }
  const updateAdmin = (id, patch) =>
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const deleteAdmin = (id) => setAdmins((prev) => prev.filter((a) => a.id !== id))

  // ---- Common code registry ----
  const addCodeGroup = (id, name) =>
    setCodeGroups((prev) =>
      prev.some((g) => g.id === id) ? prev : [...prev, { id, name, codes: [] }]
    )
  const updateCodeGroup = (id, patch) =>
    setCodeGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  const deleteCodeGroup = (id) => setCodeGroups((prev) => prev.filter((g) => g.id !== id))

  function upsertCode(groupId, code, patch) {
    setCodeGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g
        const exists = g.codes.some((c) => c.code === code)
        const codes = exists
          ? g.codes.map((c) => (c.code === code ? { ...c, ...patch } : c))
          : [...g.codes, { code, label: '', labelMy: '', active: true, order: g.codes.length + 1, ...patch }]
        return { ...g, codes }
      })
    )
  }
  const deleteCode = (groupId, code) =>
    setCodeGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, codes: g.codes.filter((c) => c.code !== code) } : g))
    )

  // ---- Menu registry (drives sidebar + user tabs) ----
  function addMenu(partial) {
    const area = partial.area || 'admin'
    const nums = menus
      .map((m) => parseInt(String(m.id).replace(/[^0-9]/g, ''), 10))
      .filter((n) => !Number.isNaN(n))
    const id = `menu-${(nums.length ? Math.max(...nums) : 0) + 1}`
    const maxOrder = Math.max(0, ...menus.filter((m) => m.area === area).map((m) => m.order || 0))
    const record = { id, area, label: '', path: '', icon: 'badge', order: maxOrder + 1, visible: true, ...partial }
    setMenus((prev) => [...prev, record])
    return record
  }
  const updateMenu = (id, patch) =>
    setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  // Grant/revoke a role's access to a menu item.
  function toggleMenuRole(id, role) {
    setMenus((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const roles = m.roles || []
        return {
          ...m,
          roles: roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role],
        }
      })
    )
  }
  // Can the current console role reach a menu? Super Admin sees everything.
  const canAccessMenu = (m) =>
    adminRole === 'super_admin' || !m.roles || m.roles.includes(adminRole)
  const deleteMenu = (id) =>
    setMenus((prev) => prev.filter((m) => m.id !== id || m.core))
  // swap order with the adjacent visible menu in the same area
  function moveMenu(id, dir) {
    setMenus((prev) => {
      const item = prev.find((m) => m.id === id)
      if (!item) return prev
      const siblings = prev
        .filter((m) => m.area === item.area)
        .sort((a, b) => a.order - b.order)
      const idx = siblings.findIndex((m) => m.id === id)
      const swapWith = siblings[idx + (dir === 'up' ? -1 : 1)]
      if (!swapWith) return prev
      return prev.map((m) => {
        if (m.id === item.id) return { ...m, order: swapWith.order }
        if (m.id === swapWith.id) return { ...m, order: item.order }
        return m
      })
    })
  }

  function toggleFavorite(factoryId) {
    setFavorites((prev) =>
      prev.includes(factoryId)
        ? prev.filter((f) => f !== factoryId)
        : [...prev, factoryId]
    )
  }

  // ---- Noticeboard actions (admin writes, user reads) ----
  function seqId(prefix, list) {
    const max = list
      .map((x) => parseInt(String(x.id).replace(/[^0-9]/g, ''), 10))
      .filter((n) => !Number.isNaN(n))
    return `${prefix}-${String((max.length ? Math.max(...max) : 0) + 1).padStart(3, '0')}`
  }

  function addNotice(partial) {
    const record = {
      id: seqId('NT', notices),
      title: partial.title || '',
      body: partial.body || '',
      date: partial.date || todayISO(),
      pinned: !!partial.pinned,
    }
    setNotices((prev) => [record, ...prev])
    return record
  }
  const updateNotice = (id, patch) =>
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  const deleteNotice = (id) => setNotices((prev) => prev.filter((n) => n.id !== id))

  function addFaq(partial) {
    const record = { id: seqId('FQ', faqs), question: partial.question || '', answer: partial.answer || '' }
    setFaqs((prev) => [...prev, record])
    return record
  }
  const updateFaq = (id, patch) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  const deleteFaq = (id) => setFaqs((prev) => prev.filter((f) => f.id !== id))

  function addInquiry(partial) {
    const record = {
      id: seqId('IQ', inquiries),
      userId: partial.userId ?? user?.id ?? null,
      userName: partial.userName || user?.displayName || 'Guest',
      subject: partial.subject || '',
      message: partial.message || '',
      date: partial.date || todayISO(),
      status: 'open',
      reply: '',
      replyDate: '',
    }
    setInquiries((prev) => [record, ...prev])
    return record
  }
  const replyInquiry = (id, reply) =>
    setInquiries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, reply, status: 'answered', replyDate: todayISO() } : q
      )
    )

  // ---- Main banners / Popups / HTML pages (CMS) ----
  function seqId(prefix, list) {
    const nums = list
      .map((x) => parseInt(String(x.id).replace(/[^0-9]/g, ''), 10))
      .filter((n) => !Number.isNaN(n))
    return `${prefix}-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')}`
  }

  function addBanner(partial) {
    const maxOrder = Math.max(0, ...banners.map((b) => b.order || 0))
    const record = { id: seqId('BN', banners), area: 'main', target: 'self', active: true, order: maxOrder + 1, ...partial }
    setBanners((prev) => [...prev, record])
    return record
  }
  const updateBanner = (id, patch) => setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  const deleteBanner = (id) => setBanners((prev) => prev.filter((b) => b.id !== id))

  function addPopup(partial) {
    const record = {
      id: seqId('PP', popups), kind: 'image', target: 'self', active: true,
      createdBy: 'Super Admin', createdAt: nowStamp(), ...partial,
    }
    setPopups((prev) => [record, ...prev])
    return record
  }
  const updatePopup = (id, patch) => setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  const deletePopup = (id) => setPopups((prev) => prev.filter((p) => p.id !== id))

  function addHtmlPage(partial) {
    const stamp = nowStamp()
    const record = {
      id: seqId('HP', htmlPages), title: '', content: '',
      createdBy: 'Super Admin', createdAt: stamp,
      history: [{ date: stamp, by: 'Super Admin' }], ...partial,
    }
    setHtmlPages((prev) => [record, ...prev])
    return record
  }
  const updateHtmlPage = (id, patch) =>
    setHtmlPages((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, ...patch, history: [{ date: nowStamp(), by: 'Super Admin' }, ...(h.history || [])] }
          : h
      )
    )
  const deleteHtmlPage = (id) => setHtmlPages((prev) => prev.filter((h) => h.id !== id))

  function resetDemoData() {
    setConsultations(seedConsultations)
    setManufacturers(seedManufacturers)
    setBuyers(seedBuyers)
    setFavorites([])
    setNotices(seedNotices)
    setFaqs(seedFaqs)
    setInquiries(seedInquiries)
    setAdmins(seedAdmins)
    setCodeGroups(seedCodeGroups)
    setMenus(seedMenus)
    setMenuPermissions(seedMenuPermissions)
    setBanners(seedBanners)
    setPopups(seedPopups)
    setHtmlPages(seedHtmlPages)
  }

  const value = {
    // state
    consultations,
    manufacturers,
    buyers,
    favorites,
    lang,
    user,
    notices,
    faqs,
    inquiries,
    admins,
    codeGroups,
    menus,
    adminRole,
    menuPermissions,
    setMenuPermissions,
    banners,
    popups,
    htmlPages,
    t,
    // setters / actions
    setLang,
    setUser,
    addConsultation,
    updateConsultation,
    addManufacturer,
    updateManufacturer,
    deleteManufacturer,
    addBuyer,
    updateBuyer,
    deleteBuyer,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    addCodeGroup,
    updateCodeGroup,
    deleteCodeGroup,
    upsertCode,
    deleteCode,
    addMenu,
    updateMenu,
    deleteMenu,
    moveMenu,
    toggleMenuRole,
    canAccessMenu,
    setAdminRole,
    addBanner,
    updateBanner,
    deleteBanner,
    addPopup,
    updatePopup,
    deletePopup,
    addHtmlPage,
    updateHtmlPage,
    deleteHtmlPage,
    toggleFavorite,
    setBuyers,
    resetDemoData,
    addNotice,
    updateNotice,
    deleteNotice,
    addFaq,
    updateFaq,
    deleteFaq,
    addInquiry,
    replyInquiry,
    factoryById: (id) => manufacturers.find((m) => m.id === id) || null,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Date.now() / new Date() are fine in the browser runtime (the workflow-script
// restriction does not apply here). Format helper:
export function todayISO() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

// "YYYY-MM-DD HH:MM:SS" timestamp for created/updated fields.
export function nowStamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  if (Number.isNaN(d.getTime())) return iso
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`
}
