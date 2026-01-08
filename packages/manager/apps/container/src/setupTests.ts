import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';
import { vi } from 'vitest';
import { fetch } from 'cross-fetch';

import './utils/tests/setup-api-mock-server';

global.fetch = fetch;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'fr',
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));
