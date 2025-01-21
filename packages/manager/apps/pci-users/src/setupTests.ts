import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));
