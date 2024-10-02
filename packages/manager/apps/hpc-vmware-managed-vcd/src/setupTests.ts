import '@testing-library/jest-dom';
import { vi } from 'vitest';
// PATCH for ODS Component to fix Error: Uncaught [TypeError: _this.attachInternals is not a function]
import 'element-internals-polyfill';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));
