import { vi } from 'vitest';

export const useTranslationMock = vi.fn().mockImplementation(() => ({
  t: (key: string) => (key.includes(':') ? `translated_${key.split(':')[1]}` : `translated_${key}`),
  i18n: {
    changeLanguage: vi.fn(),
  },
}));

export const TransMock = vi.fn().mockImplementation(({ children }) => children);
