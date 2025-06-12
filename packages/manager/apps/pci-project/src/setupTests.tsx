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
    useSearchParams: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="text-cell">{children}</div>
  ),
  DatagridColumn: {},
  Datagrid: ({
    children,
    topbar,
  }: {
    children?: React.ReactNode;
    topbar?: React.ReactNode;
  }) => (
    <div data-testid="datagrid">
      <div data-testid="layout-topbar">{topbar}</div>
      {children}
    </div>
  ),
  ErrorBanner: ({ error }: { error: unknown }) => (
    <div data-testid="error-banner">{JSON.stringify(error)}</div>
  ),
  BaseLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-layout">{children}</div>
  ),
  useResourcesV6: vi.fn(),
  Notifications: () => <div data-testid="notifications" />,
  useNotifications: () => ({
    addInfo: vi.fn(),
  }),
  useFeatureAvailability: vi.fn(),
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
  OdsLink: ({ label, ...props }: { label: string }) => (
    <a data-testid="ods-link" {...props}>
      {label}
    </a>
  ),
  OdsSpinner: () => <div data-testid="ods-spinner" />,
  OdsMessage: ({
    color,
    children,
    ...props
  }: {
    color: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="ods-message" color={color} {...props}>
      {children}
    </div>
  ),
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

vi.mock('@ovh-ux/manager-pci-common', () => ({
  PciTrustedZoneBanner: () => <div data-testid="pci-trusted-zone-banner" />,
  useTrustedZoneBanner: vi.fn(),
}));
