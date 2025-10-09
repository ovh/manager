import '@testing-library/jest-dom';
import { fetch } from 'cross-fetch';
import 'element-internals-polyfill';
import { vi } from 'vitest';

import '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';
import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';

global.fetch = fetch;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: Record<string, unknown> = await importOriginal();
  return {
    ...actual,
  };
});
