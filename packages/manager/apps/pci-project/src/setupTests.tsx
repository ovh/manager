import React from 'react';
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

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="text-cell">{children}</div>
  ),
  DatagridColumn: {},
  Datagrid: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="datagrid">{children}</div>
  ),
  ErrorBanner: ({ error }: { error: unknown }) => (
    <div data-testid="error-banner">{JSON.stringify(error)}</div>
  ),
  BaseLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-layout">{children}</div>
  ),
  useResourcesV6: vi.fn(),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsBadge: ({ color, label, ...props }: { color: string; label: string }) => (
    <div data-testid="status_badge" data-color={color} {...props}>
      {label}
    </div>
  ),
  OdsButton: ({ label, ...props }: { label: string }) => (
    <button data-testid="ods-button" {...props}>
      {label}
    </button>
  ),
  OdsSpinner: () => <div data-testid="ods-spinner" />,
}));

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-core-api') = await importOriginal();
  return {
    ...actual,
    v6: {
      get: vi.fn(),
    },
  };
});
