export function normalizeSettingsForForm(rawSettings, schema = []) {
  const items = Array.isArray(rawSettings) ? rawSettings : [];
  const byKey = new Map();

  items.forEach((s) => {
    if (!s || typeof s.key !== 'string' || !s.key) return;
    byKey.set(s.key, {
      ...s,
      value: s.value ?? '',
      type: s.type ?? 'text',
      group: s.group ?? 'general',
    });
  });

  const used = new Set();
  const out = [];

  schema.forEach((def) => {
    if (!def?.key) return;
    const existing = byKey.get(def.key);
    used.add(def.key);
    out.push({
      key: def.key,
      value: existing?.value ?? def.value ?? '',
      type: existing?.type ?? def.type ?? 'text',
      group: existing?.group ?? def.group ?? 'general',
    });
  });

  Array.from(byKey.keys())
    .filter((k) => !used.has(k))
    .sort((a, b) => a.localeCompare(b))
    .forEach((k) => out.push(byKey.get(k)));

  return out;
}

export function isValidUrlSetting(value) {
  if (value === null || value === undefined) return true;
  const s = String(value);
  if (!s) return true;
  if (s.startsWith('/')) return true;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmailSetting(value) {
  if (value === null || value === undefined) return true;
  const s = String(value);
  if (!s) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function isValidJsonSetting(value) {
  if (value === null || value === undefined) return true;
  const s = String(value);
  if (!s.trim()) return true;
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}

export function getSettingHint(key) {
  const k = String(key || '').trim();
  if (!k) return '';

  const hints = {
    site_title: 'Displayed in the header and used as the base page title.',
    site_description: 'Short tagline shown under your name and used in metadata.',
    site_author: 'Your name used in hero text and meta description fallback.',
    site_logo: 'Logo image URL (absolute or starting with /). Recommended: SVG/PNG.',
    resume_url: 'Resume PDF link (e.g. /resume/your-resume.pdf or a full URL).',
    contact_email: 'Primary contact email address displayed to visitors.',
    linkedin_url: 'Your LinkedIn profile URL.',
    github_url: 'Your GitHub profile URL.',
    profile_picture_light_default: 'Profile image used in light mode (idle).',
    profile_picture_light_hover: 'Profile image used in light mode (hover).',
    profile_picture_dark_default: 'Profile image used in dark mode (idle).',
    profile_picture_dark_hover: 'Profile image used in dark mode (hover).',
  };

  return hints[k] || '';
}

export function getSettingExample(key) {
  const k = String(key || '').trim();
  if (!k) return '';

  const examples = {
    site_title: 'Melvin Rey C Tambis',
    site_description: 'System Programmer',
    site_author: 'Melvin Rey C Tambis',
    site_logo: '/logo.svg',
    resume_url: '/resume/melvin-rey-c-tambis-resume.pdf',
    contact_email: 'you@example.com',
    linkedin_url: 'https://linkedin.com/in/your-handle',
    github_url: 'https://github.com/your-handle',
  };

  return examples[k] || '';
}
