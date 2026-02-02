import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) => `${key}${vars ? JSON.stringify(vars) : ''}`,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      exists: () => true,
      language: 'fr_FR',
    },
  }),
}));
