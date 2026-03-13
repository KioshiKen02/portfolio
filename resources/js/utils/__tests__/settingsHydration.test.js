import { describe, expect, it } from 'vitest';
import { getSettingExample, getSettingHint, isValidEmailSetting, isValidJsonSetting, isValidUrlSetting, normalizeSettingsForForm } from '../settingsHydration';

describe('settingsHydration', () => {
  it('normalizes settings with schema defaults and preserves existing values', () => {
    const raw = [
      { key: 'site_title', value: 'My Site', type: 'text', group: 'general' },
      { key: 'github_url', value: 'https://github.com/x', type: 'url', group: 'social' },
    ];
    const schema = [
      { key: 'site_title', type: 'text', group: 'general' },
      { key: 'site_description', type: 'text', group: 'general' },
    ];

    const out = normalizeSettingsForForm(raw, schema);
    expect(out.find((s) => s.key === 'site_title')?.value).toBe('My Site');
    expect(out.find((s) => s.key === 'site_description')?.value).toBe('');
    expect(out.find((s) => s.key === 'github_url')?.value).toBe('https://github.com/x');
  });

  it('accepts relative URLs and absolute URLs for url settings', () => {
    expect(isValidUrlSetting('')).toBe(true);
    expect(isValidUrlSetting('/resume/cv.pdf')).toBe(true);
    expect(isValidUrlSetting('https://example.com')).toBe(true);
    expect(isValidUrlSetting('not a url')).toBe(false);
  });

  it('validates email settings with a simple pattern', () => {
    expect(isValidEmailSetting('')).toBe(true);
    expect(isValidEmailSetting('a@b.com')).toBe(true);
    expect(isValidEmailSetting('bad')).toBe(false);
  });

  it('validates json settings', () => {
    expect(isValidJsonSetting('')).toBe(true);
    expect(isValidJsonSetting('{"a":1}')).toBe(true);
    expect(isValidJsonSetting('[1,2,3]')).toBe(true);
    expect(isValidJsonSetting('{bad')).toBe(false);
  });

  it('returns stable hints and examples for known keys', () => {
    expect(getSettingHint('site_title')).toContain('header');
    expect(getSettingExample('resume_url')).toContain('/resume/');
    expect(getSettingHint('unknown_key')).toBe('');
  });
});
