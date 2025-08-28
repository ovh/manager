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
  Trans: vi.fn(({ children }) => children),
}));

vi.mock('@/hooks/useTracking/useTracking', () => ({
  useTracking: () => ({
    trackClick: vi.fn(),
    trackPage: vi.fn(),
  }),
  usePageTracking: vi.fn(() => ({
    pageName: 'pageName',
    pageType: 'pageType',
    subApp: 'subApp',
  })),
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
  const actual: any = await importOriginal();
  return {
    ...actual,
  };
});
