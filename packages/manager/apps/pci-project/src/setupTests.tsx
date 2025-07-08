import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { fetch } from 'cross-fetch';
import { ActionMenuItem } from '@ovh-ux/manager-react-components';

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
    useHref: vi.fn(),
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-pci-common') = await importOriginal();
  return {
    ...actual,
    isDiscoveryProject: vi.fn(),
    useProject: () => ({
      data: { status: 'ok' },
    }),
    PciTrustedZoneBanner: () => <div data-testid="pci-trusted-zone-banner" />,
    useTrustedZoneBanner: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-pci-common') = await importOriginal();
  return {
    ...actual,
    isDiscoveryProject: vi.fn(),
    useProject: () => ({
      data: { status: 'ok' },
    }),
    PciTrustedZoneBanner: () => <div data-testid="pci-trusted-zone-banner" />,
    useTrustedZoneBanner: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...actual,
    DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="text-cell">{children}</div>
    ),
    DatagridColumn: {},
    Datagrid: ({
      children,
      topbar,
      isLoading,
    }: {
      children?: React.ReactNode;
      topbar?: React.ReactNode;
      isLoading?: boolean;
    }) => (
      <div data-testid="datagrid">
        {isLoading ? (
          <div data-testid="loading-row" />
        ) : (
          <>
            <div data-testid="layout-topbar">{topbar}</div>
            {children}
          </>
        )}
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
    useNotifications: vi.fn(() => ({
      addInfo: vi.fn(),
      addSuccess: vi.fn(),
      addError: vi.fn(),
    })),
    useFeatureAvailability: vi.fn(),
    ActionMenu: ({
      id,
      items,
      isCompact,
    }: {
      id: string;
      items: ActionMenuItem[];
      isCompact: boolean;
    }) => (
      <div data-testid="action-menu" data-id={id} data-is-compact={isCompact}>
        {items.map((item) => (
          <a
            key={item.id}
            data-testid={`action-item-${item.id}`}
            href={item.href}
            onClick={item.onClick}
          >
            {item.label}
          </a>
        ))}
      </div>
    ),
  };
});

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual: typeof import('@ovhcloud/ods-components/react') = await importOriginal();
  return {
    ...actual,
    OdsBadge: ({
      color,
      label,
      ...props
    }: {
      color: string;
      label: string;
    }) => (
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
    OdsSpinner: () => <div data-testid="ods-spinner" />,
  };
});

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-core-api') = await importOriginal();
  return {
    ...actual,
    v6: {
      get: vi.fn(),
      delete: vi.fn(),
      post: vi.fn(),
    },
  };
});
