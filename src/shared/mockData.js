// All seed data lives here. No backend — the AppContext hydrates from
// localStorage and falls back to these seeds on first run.

export const seedManufacturers = [
  {
    id: 'MF-001',
    name: 'Shwe Thread Garment Co.',
    status: 'verified',
    region: 'yangon',
    zone: 'hlaing_tharyar',
    township: 'Hlaing Tharyar Ind. Zone 3',
    regStatus: 'registered',
    regNumber: 'YGN-114/2019',
    fabrics: ['woven', 'knit'],
    items: ['suits', 'uniforms'],
    monthlyCapacity: 45000,
    clients: ['H&M', 'Uniqlo', 'Zara'],
    certifications: ['WRAP', 'ISO 9001'],
    photos: 3,
    rating: 4.8,
    color: '#6F4E37',
  },
  {
    id: 'MF-002',
    name: 'Mandalay Knitwear Mills',
    status: 'verified',
    region: 'mandalay',
    zone: null,
    township: 'Pyigyidagun Ind. Zone',
    regStatus: 'registered',
    regNumber: 'MDY-208/2020',
    fabrics: ['knit', 'special'],
    items: ['casual', 'kids'],
    monthlyCapacity: 30000,
    clients: ['GAP', 'Primark'],
    certifications: ['BSCI'],
    photos: 4,
    rating: 4.6,
    color: '#A07C5B',
  },
  {
    id: 'MF-003',
    name: 'Golden Denim Factory',
    status: 'verified',
    region: 'yangon',
    zone: 'shwe_pyi_thar',
    township: 'Shwe Pyi Thar Zone 1',
    regStatus: 'registered',
    regNumber: 'YGN-330/2018',
    fabrics: ['denim', 'woven'],
    items: ['casual', 'uniforms'],
    monthlyCapacity: 60000,
    clients: ['Levi Strauss', 'Bestseller'],
    certifications: ['WRAP', 'BSCI', 'ISO 14001'],
    photos: 6,
    rating: 4.9,
    color: '#C7A986',
  },
  {
    id: 'MF-004',
    name: 'Eastern Leather Works',
    status: 'verified',
    region: 'yangon',
    zone: 'south_dagon',
    township: 'South Dagon Ind. Zone 2',
    regStatus: 'registered',
    regNumber: 'YGN-402/2021',
    fabrics: ['leather', 'special'],
    items: ['suits', 'casual'],
    monthlyCapacity: 18000,
    clients: ['Aldo', 'Local Designers'],
    certifications: ['ISO 9001'],
    photos: 3,
    rating: 4.4,
    color: '#6F4E37',
  },
  {
    id: 'MF-005',
    name: 'Pyi Thu Uniform Manufacturing',
    status: 'pending',
    region: 'yangon',
    zone: 'hlaing_tharyar',
    township: 'Hlaing Tharyar Ind. Zone 1',
    regStatus: 'pending',
    regNumber: '',
    fabrics: ['woven'],
    items: ['uniforms', 'kids'],
    monthlyCapacity: 25000,
    clients: ['Govt Schools', 'Hospitals'],
    certifications: [],
    photos: 3,
    rating: 0,
    color: '#A07C5B',
  },
]

export const seedBuyers = [
  {
    id: 'BR-001',
    name: 'Aurora Apparel',
    businessType: 'brand_enterprise',
    city: 'Yangon',
    contactPerson: 'Ma Thida',
    phone: '+95 9 770 000 111',
  },
  {
    id: 'BR-002',
    name: 'Nova Designer Studio',
    businessType: 'designer_brand',
    city: 'Mandalay',
    contactPerson: 'Ko Zaw',
    phone: '+95 9 770 000 222',
  },
  {
    id: 'BR-003',
    name: 'CityMall Online',
    businessType: 'online_mall',
    city: 'Yangon',
    contactPerson: 'Su Su',
    phone: '+95 9 770 000 333',
  },
]

// Pre-seeded consultations so the Admin table is not empty on first load.
export const seedConsultations = [
  {
    id: 'ORD-0001',
    orderNo: 'ORD-0001',
    requestDate: '2026-07-02',
    applicantName: 'Aurora Apparel',
    buyerId: 'BR-001',
    brandType: 'brand_enterprise',
    fabricType: 'woven',
    itemType: 'suits',
    location: 'yangon',
    aiRecStatus: 'recommended',
    status: 'completed',
    matchedFactoryId: 'MF-001',
    matchScore: 92,
    note: 'Need 5,000 formal suits for Q4 launch.',
    coordinatorNotes: 'Matched with Shwe Thread. Sample approved.',
    date: '2026-07-10',
    time: '10:00',
    source: 'app',
    transcript: [
      { role: 'ai', text: "Hi! Let's find the best-matched factory." },
      { role: 'user', text: 'Fabric: Woven' },
      { role: 'user', text: 'Item: Suits' },
      { role: 'user', text: 'Location: Yangon' },
      { role: 'ai', text: 'Top match: Shwe Thread Garment Co. — 92% match.' },
    ],
  },
  {
    id: 'ORD-0002',
    orderNo: 'ORD-0002',
    requestDate: '2026-07-05',
    applicantName: 'Nova Designer Studio',
    buyerId: 'BR-002',
    brandType: 'designer_brand',
    fabricType: 'knit',
    itemType: 'casual',
    location: 'mandalay',
    aiRecStatus: 'recommended',
    status: 'confirmed',
    matchedFactoryId: 'MF-002',
    matchScore: 88,
    note: 'Small-batch premium knitwear.',
    coordinatorNotes: '',
    date: '2026-07-14',
    time: '14:30',
    source: 'app',
    transcript: [
      { role: 'ai', text: "Hi! Let's find the best-matched factory." },
      { role: 'user', text: 'Fabric: Knit' },
      { role: 'user', text: 'Item: Casual' },
      { role: 'user', text: 'Location: Mandalay' },
      { role: 'ai', text: 'Top match: Mandalay Knitwear Mills — 88% match.' },
    ],
  },
  {
    id: 'ORD-0003',
    orderNo: 'ORD-0003',
    requestDate: '2026-07-11',
    applicantName: 'CityMall Online',
    buyerId: 'BR-003',
    brandType: 'online_mall',
    fabricType: 'denim',
    itemType: 'casual',
    location: 'yangon',
    aiRecStatus: 'recommended',
    status: 'requested',
    matchedFactoryId: 'MF-003',
    matchScore: 90,
    note: 'Denim jackets, 8,000 units.',
    coordinatorNotes: '',
    date: '2026-07-20',
    time: '11:00',
    source: 'app',
    transcript: [
      { role: 'ai', text: "Hi! Let's find the best-matched factory." },
      { role: 'user', text: 'Fabric: Denim' },
      { role: 'user', text: 'Item: Casual' },
      { role: 'user', text: 'Location: Yangon' },
      { role: 'ai', text: 'Top match: Golden Denim Factory — 90% match.' },
    ],
  },
  {
    id: 'ORD-0004',
    orderNo: 'ORD-0004',
    requestDate: '2026-07-12',
    applicantName: 'Walk-in — Sunrise Traders',
    buyerId: null,
    brandType: 'wholesale_retail',
    fabricType: 'leather',
    itemType: 'casual',
    location: 'yangon',
    aiRecStatus: 'excluded',
    status: 'cancelled',
    matchedFactoryId: null,
    matchScore: 0,
    note: 'Requested capacity beyond current partners.',
    coordinatorNotes: 'No verified leather factory available at requested volume.',
    date: '2026-07-15',
    time: '09:00',
    source: 'manual',
    transcript: [],
  },
]

// Common code registry — the reference values behind the app's dropdowns/chips.
export const seedCodeGroups = [
  {
    id: 'FABRIC_TYPE',
    name: 'Fabric Type',
    codes: [
      { code: 'woven', label: 'Woven', labelMy: 'ရက်ကန်း', order: 1, active: true },
      { code: 'knit', label: 'Knit', labelMy: 'ကြိုးထိုး', order: 2, active: true },
      { code: 'denim', label: 'Denim', labelMy: 'ဂျင်း', order: 3, active: true },
      { code: 'leather', label: 'Leather', labelMy: 'သားရေ', order: 4, active: true },
      { code: 'special', label: 'Special', labelMy: 'အထူး', order: 5, active: true },
    ],
  },
  {
    id: 'ITEM_TYPE',
    name: 'Item Type',
    codes: [
      { code: 'suits', label: 'Suits', labelMy: 'ဝတ်စုံ', order: 1, active: true },
      { code: 'casual', label: 'Casual Wear', labelMy: 'ပေါ့ပေါ့ဝတ်စုံ', order: 2, active: true },
      { code: 'uniforms', label: 'Uniforms', labelMy: 'ယူနီဖောင်း', order: 3, active: true },
      { code: 'kids', label: 'Kids Wear', labelMy: 'ကလေးဝတ်စုံ', order: 4, active: true },
    ],
  },
  {
    id: 'BUSINESS_TYPE',
    name: 'Business Type',
    codes: [
      { code: 'brand_enterprise', label: 'Brand Enterprise', labelMy: 'ကုန်အမှတ်တံဆိပ်လုပ်ငန်း', order: 1, active: true },
      { code: 'designer_brand', label: 'Designer Brand', labelMy: 'ဒီဇိုင်နာ အမှတ်တံဆိပ်', order: 2, active: true },
      { code: 'promotion', label: 'Promotion', labelMy: 'ပရိုမိုးရှင်း', order: 3, active: true },
      { code: 'online_mall', label: 'Online Shopping Mall', labelMy: 'အွန်လိုင်းစျေးဝယ်စင်တာ', order: 4, active: true },
      { code: 'startup', label: 'Startup', labelMy: 'စတင်လုပ်ငန်း', order: 5, active: true },
      { code: 'wholesale_retail', label: 'Wholesale/Retail', labelMy: 'လက်ကား/လက်လီ', order: 6, active: true },
    ],
  },
  {
    id: 'REGION',
    name: 'Region',
    codes: [
      { code: 'yangon', label: 'Yangon', labelMy: 'ရန်ကုန်', order: 1, active: true },
      { code: 'mandalay', label: 'Mandalay', labelMy: 'မန္တလေး', order: 2, active: true },
      { code: 'other', label: 'Other', labelMy: 'အခြား', order: 3, active: true },
    ],
  },
  {
    id: 'CONSULT_STATUS',
    name: 'Consultation Status',
    codes: [
      { code: 'requested', label: 'Requested', labelMy: 'တောင်းဆိုထား', order: 1, active: true },
      { code: 'confirmed', label: 'Confirmed', labelMy: 'အတည်ပြုပြီး', order: 2, active: true },
      { code: 'completed', label: 'Completed', labelMy: 'ပြီးစီး', order: 3, active: true },
      { code: 'linked', label: 'Linked', labelMy: 'ချိတ်ဆက်ပြီး', order: 4, active: true },
      { code: 'cancelled', label: 'Cancelled', labelMy: 'ပယ်ဖျက်', order: 5, active: true },
    ],
  },
]

// Navigation menu registry — drives the admin sidebar and the user bottom tabs.
// `core: true` items cannot be hidden or deleted (safety against lock-out).
export const seedMenus = [
  { id: 'm_dashboard', area: 'admin', label: 'Dashboard', path: '/admin', icon: 'home', order: 1, visible: true, core: true, roles: ['super_admin', 'coordinator', 'viewer'] },
  { id: 'm_main', area: 'admin', label: 'Main Management', path: '/admin/main', icon: 'home', order: 1.1, visible: true, roles: ['super_admin', 'coordinator'] },
  { id: 'm_popups', area: 'admin', label: 'Popup Management', path: '/admin/popups', icon: 'bell', order: 1.2, visible: true, roles: ['super_admin', 'coordinator'] },
  { id: 'm_html', area: 'admin', label: 'HTML Pages', path: '/admin/html', icon: 'badge', order: 1.3, visible: true, roles: ['super_admin', 'coordinator'] },
  { id: 'm_consultations', area: 'admin', label: 'Consultations', path: '/admin/consultations', icon: 'chat', order: 2, visible: true, roles: ['super_admin', 'coordinator', 'viewer'] },
  { id: 'm_manufacturers', area: 'admin', label: 'Manufacturers', path: '/admin/manufacturers', icon: 'factory', order: 3, visible: true, roles: ['super_admin', 'coordinator'] },
  { id: 'm_buyers', area: 'admin', label: 'Buyers / Brands', path: '/admin/buyers', icon: 'user', order: 4, visible: true, roles: ['super_admin', 'coordinator'] },
  { id: 'm_noticeboard', area: 'admin', label: 'Noticeboard', path: '/admin/noticeboard', icon: 'bell', order: 5, visible: true, roles: ['super_admin', 'coordinator'] },
  { id: 'm_admins', area: 'admin', label: 'Admins', path: '/admin/admins', icon: 'user', order: 6, visible: true, roles: ['super_admin'] },
  { id: 'm_codes', area: 'admin', label: 'Common Codes', path: '/admin/codes', icon: 'badge', order: 7, visible: true, core: true, roles: ['super_admin'] },
  { id: 'm_menus', area: 'admin', label: 'Menu Management', path: '/admin/menus', icon: 'badge', order: 8, visible: true, core: true, roles: ['super_admin'] },
  { id: 'm_menu_access', area: 'admin', label: 'Menu Access', path: '/admin/menu-access', icon: 'badge', order: 9, visible: true, core: true, roles: ['super_admin'] },
  { id: 'm_reports', area: 'admin', label: 'Reports', path: '/admin/reports', icon: 'badge', order: 10, visible: true, roles: ['super_admin', 'coordinator', 'viewer'] },
  { id: 'u_home', area: 'user', key: 'home', label: 'Home', path: '/app', icon: 'home', order: 1, visible: true, core: true },
  { id: 'u_consult', area: 'user', key: 'aiConsult', label: 'AI Consult', path: '/app/consult', icon: 'sparkles', order: 2, visible: true },
  { id: 'u_bookings', area: 'user', key: 'bookings', label: 'Bookings', path: '/app/bookings', icon: 'calendar', order: 3, visible: true },
  { id: 'u_favorites', area: 'user', key: 'favorites', label: 'Favorites', path: '/app/favorites', icon: 'heart', order: 4, visible: true },
  { id: 'u_profile', area: 'user', key: 'profile', label: 'Profile', path: '/app/profile', icon: 'user', order: 5, visible: true, core: true },
]

// Main-page banners (메인관리)
export const seedBanners = [
  { id: 'BN-001', name: 'Fuel Support Program', description: 'Program announcement banner', area: 'main', imageUrl: '', mobileUrl: '', url: '', target: 'self', active: true, order: 1 },
  { id: 'BN-002', name: 'Daily Inspection Campaign', description: 'Seasonal campaign', area: 'main', imageUrl: '', mobileUrl: '', url: '', target: 'self', active: true, order: 2 },
  { id: 'BN-003', name: 'New Collection', description: 'New arrivals promo', area: 'main', imageUrl: '', mobileUrl: '', url: 'https://example.com', target: 'blank', active: true, order: 3 },
  { id: 'BN-004', name: 'Wholesale Deals', description: 'B2B offer', area: 'main', imageUrl: '', mobileUrl: '', url: '', target: 'self', active: false, order: 4 },
]

// Popups (팝업 관리)
export const seedPopups = [
  {
    id: 'PP-001', name: 'Official Launch Notice', kind: 'image',
    width: 420, height: 520, top: 120, left: 200,
    startDate: '2026-05-01', endDate: '2026-07-08',
    webImage: '', mobileImage: '', url: '', target: 'self', active: true,
    createdBy: 'Super Admin', createdAt: '2026-07-03 18:31:05',
  },
]

// HTML content pages (HTML 페이지관리)
export const seedHtmlPages = [
  { id: 'HP-004', title: 'Testing Size', content: '<h2>Testing Size</h2><p>Sample HTML content.</p>', createdBy: 'Super Admin', createdAt: '2026-07-07 17:34:42', history: [{ date: '2026-07-07 17:34:42', by: 'Super Admin' }] },
  { id: 'HP-003', title: 'Testing HTML', content: '<p>Some <b>rich</b> content.</p>', createdBy: 'Super Admin', createdAt: '2026-07-07 17:19:24', history: [{ date: '2026-07-07 17:19:24', by: 'Super Admin' }] },
  { id: 'HP-002', title: 'Test Page', content: '<p>테스트</p>', createdBy: 'Super Admin', createdAt: '2026-07-07 17:08:26', history: [{ date: '2026-07-07 17:08:26', by: 'Super Admin' }] },
  { id: 'HP-001', title: 'Test HTML', content: '<h1>Test HTML</h1>', createdBy: 'Super Admin', createdAt: '2026-07-07 13:33:55', history: [{ date: '2026-07-07 13:33:55', by: 'Super Admin' }] },
]

// Per-role, per-menu CRUD permissions: perms[role][menuId] = {read,write,edit,delete,download}
export function buildSeedMenuPermissions() {
  const roles = ['super_admin', 'coordinator', 'viewer']
  const out = {}
  roles.forEach((role) => {
    out[role] = {}
    seedMenus
      .filter((m) => m.area === 'admin')
      .forEach((m) => {
        const allowed = role === 'super_admin' || (m.roles || []).includes(role)
        out[role][m.id] = {
          read: role === 'super_admin' ? true : allowed,
          write: role === 'super_admin' ? true : allowed && role === 'coordinator',
          edit: role === 'super_admin' ? true : allowed && role === 'coordinator',
          delete: role === 'super_admin',
          download: role === 'super_admin' ? true : allowed,
        }
      })
  })
  return out
}
export const seedMenuPermissions = buildSeedMenuPermissions()

// Admin / coordinator accounts (managed in the Admins console page).
export const seedAdmins = [
  { id: 'AD-001', name: 'Coordinator', email: 'coordinator@oveile.mm', role: 'super_admin', status: 'active' },
  { id: 'AD-002', name: 'Aung Aung', email: 'aung@oveile.mm', role: 'coordinator', status: 'active' },
  { id: 'AD-003', name: 'May Thu', email: 'may@oveile.mm', role: 'viewer', status: 'suspended' },
]

// Noticeboard seeds — managed by admin, read by the user app.
export const seedNotices = [
  {
    id: 'NT-001',
    title: 'Welcome to OVEILE',
    body: 'Source verified Myanmar garment factories with AI assistance. Book a consultation to get started.',
    date: '2026-07-01',
    pinned: true,
  },
  {
    id: 'NT-002',
    title: 'New verified factories added',
    body: 'Three new WRAP-certified factories in Yangon are now available for consultation.',
    date: '2026-07-08',
    pinned: false,
  },
  {
    id: 'NT-003',
    title: 'Scheduled maintenance',
    body: 'The platform will be briefly unavailable on 20 Jul, 1:00–2:00 AM (MMT).',
    date: '2026-07-14',
    pinned: false,
  },
]

export const seedFaqs = [
  {
    id: 'FQ-001',
    question: 'How does AI factory matching work?',
    answer: 'Answer 3 quick questions (fabric, item, location) in AI Consult and we score verified factories against your needs, returning the best matches.',
  },
  {
    id: 'FQ-002',
    question: 'How do I book a consultation?',
    answer: 'Tap "Book Consultation with This Factory" on any match, choose a date and time, and our coordinator team will confirm it.',
  },
  {
    id: 'FQ-003',
    question: 'How do I register my factory?',
    answer: 'From the Welcome screen choose Register → Manufacturer and complete the 5-step form. Your profile goes live once a coordinator verifies it.',
  },
]

export const seedInquiries = [
  {
    id: 'IQ-001',
    userId: 'BR-001',
    userName: 'Aurora Apparel',
    subject: 'Minimum order quantity',
    message: 'What is the typical minimum order quantity for suits?',
    date: '2026-07-11',
    status: 'answered',
    reply: 'Most partner factories accept from 500 units for suits. We can confirm per factory.',
    replyDate: '2026-07-12',
  },
  {
    id: 'IQ-002',
    userId: 'BR-003',
    userName: 'CityMall Online',
    subject: 'Sample lead time',
    message: 'How long does a denim sample usually take?',
    date: '2026-07-13',
    status: 'open',
    reply: '',
    replyDate: '',
  },
]

// The AI "matching engine" — pure function, no backend.
// Scores verified manufacturers against the buyer's structured answers.
export function matchFactories({ fabricType, itemType, location }, manufacturers) {
  const verified = manufacturers.filter((m) => m.status === 'verified')
  const scored = verified.map((m) => {
    let score = 55
    if (fabricType && m.fabrics.includes(fabricType)) score += 20
    if (itemType && m.items.includes(itemType)) score += 15
    if (location && (m.region === location || location === 'any')) score += 10
    // deterministic jitter from id so results feel varied but stable
    const jitter = (m.id.charCodeAt(m.id.length - 1) % 6) - 2
    score = Math.max(40, Math.min(99, score + jitter))
    return { ...m, matchScore: score }
  })
  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
}
