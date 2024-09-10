import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';
import { fetch } from 'cross-fetch';
global.fetch = fetch;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));