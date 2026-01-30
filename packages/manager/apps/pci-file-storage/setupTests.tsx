import { vi } from 'vitest';
import '@testing-library/jest-dom';

// jsdom does not provide ResizeObserver (used by ODS Popover and others)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => `${key}${vars ? JSON.stringify(vars) : ''}`,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      exists: () => true,
      language: 'fr_FR',
    },
  }),
  Trans: ({ i18nKey, values }: { i18nKey: string; values?: Record<string, unknown> }) => {
    const keyValuePairs = values ? Object.entries(values).map(([key, value]) => `${key}:${value}`) : null;
    return `${i18nKey}${keyValuePairs ? ` ${keyValuePairs.join(' ')}` : ''}`.trim();
  },
}));
