// Design tokens extracted from the OVEILE reference mockup.
// Kept in JS as well as Tailwind config so non-Tailwind consumers
// (charts, inline styles, xlsx cell colors) can share the palette.

// Deterministic brown avatar shade per factory id. Derived at render time so
// it always follows the theme — never a stale color cached in localStorage.
const AVATAR_SHADES = ['#6F4E37', '#A07C5B', '#8A6244', '#C7A986', '#5A3F2C']
export function factoryAvatar(id = '') {
  let sum = 0
  for (let i = 0; i < String(id).length; i++) sum += String(id).charCodeAt(i)
  return AVATAR_SHADES[sum % AVATAR_SHADES.length]
}

// Approximate coordinates for map display, keyed by industrial zone then region.
export const LOCATION_COORDS = {
  hlaing_tharyar: { lat: 16.873, lng: 96.049 },
  shwe_pyi_thar: { lat: 16.93, lng: 96.083 },
  south_dagon: { lat: 16.83, lng: 96.23 },
  yangon: { lat: 16.85, lng: 96.16 },
  mandalay: { lat: 21.975, lng: 96.0836 },
  other: { lat: 19.7633, lng: 96.0785 },
}

export function factoryCoords(m) {
  if (!m) return LOCATION_COORDS.yangon
  return LOCATION_COORDS[m.zone] || LOCATION_COORDS[m.region] || LOCATION_COORDS.yangon
}

export const colors = {
  primary: '#6F4E37',
  primaryLight: '#A07C5B',
  mint: '#DFC9AC',
  bg: '#FFFFFF',
  surface: '#F5EFE7',
  textPrimary: '#2A2019',
  textSecondary: '#8A7A6A',
  border: '#E7DED3',
  success: '#8A6244',
  warning: '#E0A63A',
  danger: '#D2555A',
}

// Business types for General Members (Type A). Single-select.
export const BUSINESS_TYPES = [
  { id: 'brand_enterprise', en: 'Brand Enterprise', my: 'ကုန်အမှတ်တံဆိပ်လုပ်ငန်း' },
  { id: 'designer_brand', en: 'Designer Brand', my: 'ဒီဇိုင်နာ အမှတ်တံဆိပ်' },
  { id: 'promotion', en: 'Promotion', my: 'ပရိုမိုးရှင်း' },
  { id: 'online_mall', en: 'Online Shopping Mall', my: 'အွန်လိုင်းစျေးဝယ်စင်တာ' },
  { id: 'startup', en: 'Startup', my: 'စတင်လုပ်ငန်း' },
  { id: 'wholesale_retail', en: 'Wholesale/Retail', my: 'လက်ကား/လက်လီ' },
]

export const FABRIC_TYPES = [
  { id: 'woven', en: 'Woven', my: 'ရက်ကန်း' },
  { id: 'knit', en: 'Knit', my: 'ကြိုးထိုး' },
  { id: 'denim', en: 'Denim', my: 'ဂျင်း' },
  { id: 'leather', en: 'Leather', my: 'သားရေ' },
  { id: 'special', en: 'Special', my: 'အထူး' },
]

export const ITEM_TYPES = [
  { id: 'suits', en: 'Suits', my: 'ဝတ်စုံ' },
  { id: 'casual', en: 'Casual Wear', my: 'ပေါ့ပေါ့ဝတ်စုံ' },
  { id: 'uniforms', en: 'Uniforms', my: 'ယူနီဖောင်း' },
  { id: 'kids', en: 'Kids Wear', my: 'ကလေးဝတ်စုံ' },
]

export const REGIONS = [
  { id: 'yangon', en: 'Yangon', my: 'ရန်ကုန်' },
  { id: 'mandalay', en: 'Mandalay', my: 'မန္တလေး' },
  { id: 'other', en: 'Other', my: 'အခြား' },
]

export const YANGON_ZONES = [
  { id: 'hlaing_tharyar', en: 'Hlaing Tharyar', my: 'လှိုင်သာယာ' },
  { id: 'shwe_pyi_thar', en: 'Shwe Pyi Thar', my: 'ရွှေပြည်သာ' },
  { id: 'south_dagon', en: 'South Dagon', my: 'တောင်ဒဂုံ' },
  { id: 'other', en: 'Other', my: 'အခြား' },
]

// Consultation lifecycle statuses -> map to StatusBadge tokens.
export const CONSULT_STATUS = {
  requested: { en: 'Requested', my: 'တောင်းဆိုထား', tone: 'warning' },
  confirmed: { en: 'Confirmed', my: 'အတည်ပြုပြီး', tone: 'info' },
  completed: { en: 'Completed', my: 'ပြီးစီး', tone: 'success' },
  linked: { en: 'Linked', my: 'ချိတ်ဆက်ပြီး', tone: 'primary' },
  cancelled: { en: 'Cancelled', my: 'ပယ်ဖျက်', tone: 'danger' },
}

export const AI_REC_STATUS = {
  recommended: { en: 'Recommended', my: 'အကြံပြုထား', tone: 'success' },
  excluded: { en: 'Excluded', my: 'ဖယ်ထုတ်ထား', tone: 'muted' },
}

export const ADMIN_ROLES = [
  { id: 'super_admin', label: 'Super Admin' },
  { id: 'coordinator', label: 'Coordinator' },
  { id: 'viewer', label: 'Viewer' },
]

// CRUD-style permissions assignable per menu, per role.
export const MENU_PERMISSIONS = [
  { id: 'read', label: 'Read' },
  { id: 'write', label: 'Write' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'download', label: 'Download' },
]

export const ACCOUNT_STATUS = {
  active: { label: 'Active', tone: 'success' },
  suspended: { label: 'Suspended', tone: 'danger' },
}

export const MANUFACTURER_STATUS = {
  pending: { en: 'Applied', my: 'လျှောက်ထားပြီး', tone: 'warning' },
  verified: { en: 'Confirmed', my: 'အတည်ပြုပြီး', tone: 'success' },
  rejected: { en: 'Rejected', my: 'ငြင်းပယ်', tone: 'danger' },
  suspended: { en: 'Suspended', my: 'ရပ်ဆိုင်းထား', tone: 'muted' },
}

// The three application states a coordinator can set on a manufacturer.
export const MANUFACTURER_APPLIED_OPTIONS = [
  { id: 'pending', label: 'Applied' },
  { id: 'verified', label: 'Confirmed' },
  { id: 'rejected', label: 'Rejected' },
]
