import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { fetch } from 'cross-fetch';
import { ActionMenuItem } from '@ovh-ux/manager-react-components';

global.fetch = fetch;

// Handle unhandled promise rejections in tests to prevent Vitest warnings
const originalUnhandledRejection = process.listeners('unhandledRejection');
process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', (reason, promise) => {
  // Check if this is a test-related rejection that we want to suppress
  if (reason instanceof Error && reason.message.includes('Navigation error')) {
    // Silently handle navigation errors in tests
    return;
  }
  // For other unhandled rejections, call the original handlers
  originalUnhandledRejection.forEach((handler) => {
    if (typeof handler === 'function') {
      handler(reason, promise);
    }
  });
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  Translation: vi.fn(({ children }) => children((key: string) => key)),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

const trackClickMock = vi.fn();
const trackPageMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackClickMock,
      trackPage: trackPageMock,
    }),
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
    usePciUrl: () => '#/pci/projects/123',
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
    OdsLink: ({
      label,
      iconAlignment, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...props
    }: {
      label: string;
      iconAlignment?: string;
    }) => (
      <a data-testid="ods-link" {...props}>
        {label}
      </a>
    ),
    OdsSpinner: () => <div data-testid="ods-spinner" />,
    OdsMessage: ({
      color,
      children,
      isDismissible,
      ...props
    }: {
      color: string;
      children: React.ReactNode;
      isDismissible?: boolean;
    }) => (
      <div
        data-testid="ods-message"
        data-color={color}
        data-is-dismissible={isDismissible}
        {...props}
      >
        {children}
      </div>
    ),
    OdsText: ({ children, ...props }: { children: React.ReactNode }) => (
      <div data-testid="ods-text" {...props}>
        {children}
      </div>
    ),
    OdsIcon: ({ name, ...props }: { name: string }) => (
      <div data-testid="ods-icon" data-name={name} {...props} />
    ),
    OdsCard: ({
      children,
      color,
      className,
      ...props
    }: {
      children: React.ReactNode;
      color?: string;
      className?: string;
    }) => (
      <div
        data-testid="ods-card"
        className={className}
        data-color={color}
        {...props}
      >
        {children}
      </div>
    ),
    OdsModal: ({
      isOpen,
      children,
      onOdsClose,
      isDismissible,
      ...restProps
    }: {
      isOpen: boolean;
      children: React.ReactNode;
      onOdsClose: () => void;
      isDismissible?: boolean;
    }) =>
      isOpen ? (
        <div
          data-testid="ods-modal"
          data-isopen={isOpen.toString()}
          data-isdismissible={isDismissible?.toString()}
          {...restProps}
          onClick={() => onOdsClose && onOdsClose()}
        >
          {children}
        </div>
      ) : null,
    OdsRadio: ({
      inputId,
      name,
      onClick,
      ...props
    }: {
      inputId: string;
      name: string;
      onClick?: () => void;
    }) => (
      <input
        type="radio"
        id={inputId}
        name={name}
        data-testid="ods-radio"
        onClick={onClick}
        {...props}
      />
    ),
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
