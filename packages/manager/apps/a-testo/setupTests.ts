import { vi } from 'vitest';

// Mock @ovh-ux/manager-react-shell-client FIRST to avoid ShellContext module resolution issues
// This must be hoisted and run before any other imports that might use this module
const { trackClickMock } = vi.hoisted(() => {
  return { trackClickMock: vi.fn() };
});

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const React = await import('react');

  // Create a mock ShellContext
  const ShellContext = React.createContext(null);

  // Return a mock without trying to import the original to avoid module resolution errors
  return {
    ShellContext,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
    ShellContextType: {} as any,
    TrackingContextParams: {} as any,
    PageType: {} as any,
    initShellContext: vi.fn(),
    initI18n: vi.fn(),
  };
});

import '@testing-library/jest-dom';
import { fetch } from 'cross-fetch';
import 'element-internals-polyfill';

import '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';
import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';

global.fetch = fetch;

vi.mock('react-i18next', async (importOriginal) => {
  const actual: typeof import('react-i18next') = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: Record<string, unknown> = await importOriginal();
  return {
    ...actual,
  };
});
