import { vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';
import { Navigate, NavLinkProps, Path, To } from 'react-router-dom';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';

const shellMock = ({
  ux: {
    hidePreloader: vi.fn(),
    showPreloader: vi.fn(),
  },
  environment: {
    getEnvironment: vi.fn(async () => ({
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
      environment: 'test',
    })),
    setUniverse: vi.fn(async () => {}),
    setApplication: vi.fn(async () => {}),
    setUser: vi.fn(async () => {}),
  },
  i18n: {
    t: (key: string) => key,
  },
  routing: {
    goTo: vi.fn(),
    getCurrentRoute: vi.fn(),
  },
  auth: {
    login: vi.fn(),
    logout: vi.fn(),
    getUser: vi.fn(),
  },
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
} as unknown) as ShellContextType['shell'];

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackCurrentPage: vi.fn(),
      trackClick: vi.fn(),
      trackPage: vi.fn(),
    }),
    getClickProps: vi.fn((params) => params),
    getPageProps: vi.fn((params) => params),
    ShellContext: React.createContext({
      shell: { ux: { hidePreloader: vi.fn() } },
    }),
    initShellContext: async () => ({
      shell: shellMock,
    }),
    useRouteSynchro: vi.fn(),
    useShell: () => ({
      navigation: {},
      environment: {
        getEnvironment: vi.fn(async () => ({
          getUser: vi.fn(),
        })),
      },
    }),
  };
});

export const navigate = vi.fn();
vi.mock('react-router-dom', async (importActual) => {
  return {
    ...(await importActual<typeof import('react-router-dom')>()),
    useLocation: vi.fn(() => ({
      pathname: '',
      search: '',
    })),
    useResolvedPath: vi.fn(() => ({
      pathname: '',
    })),
    useNavigate: vi.fn(() => navigate),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
    useMatches: vi.fn(() => []),
    useHref: vi.fn<(url: To) => string>((url) =>
      typeof url === 'string' ? url : (url as Path).pathname,
    ),
    useParams: vi.fn(
      () =>
        ({
          serviceName: 'serviceName',
          domain: 'domain',
        } as Record<string, string | undefined>),
    ),
  };
});

vi.mock('@ovh-ux/muk', async () => {
  return {
    Datagrid: ({
      columns,
      topbar,
      totalCount,
      hasNextPage,
      isLoading,
      columnVisibility,
      onFetchNextPage,
      resourceType,
      ...props
    }: React.PropsWithChildren<{
      columns?: Array<{ id: string; header?: string }>;
      totalCount: number;
      hasNextPage: any;
      topbar?: React.ReactElement;
      [key: string]: unknown;
    }>) => (
      <div data-testid="datagrid" {...props}>
        {topbar}
        {columns?.map((column) => (
          <div key={column.id} data-testid={`header-${column.id}`}>
            {column.header || column.id}
          </div>
        ))}
      </div>
    ),
    ChangelogMenu: ({
      id,
      links,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      links?: Record<string, string>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="action-menu" data-id={id} {...props}>
        {links &&
          Object.entries(links).map(([key, value]) => (
            <a key={key} data-testid={`changelog-link-${key}`} href={value}>
              {key}
            </a>
          ))}
      </div>
    ),
    ActionMenu: ({
      id,
      items,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      items?: Array<{ id: number; label: string; onClick?: () => void }>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="action-menu" data-id={id} {...props}>
        {items?.map((item) => (
          <button
            key={item.id}
            data-testid={`action-item-${item.id}`}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </div>
    ),
    GuideMenu: ({
      id,
      items,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      items?: Array<{
        id: number;
        label: string;
        href?: string;
        onClick?: () => void;
      }>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="guide-menu" data-id={id} {...props}>
        {items?.map((item) => (
          <button
            key={item.id}
            data-testid={`guide-item-${item.id}`}
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}
      </div>
    ),
    BaseLayout: ({
      breadcrumb,
      message,
      children,
      tabs,
    }: React.PropsWithChildren<{
      children: React.ReactNode;
      message: React.ReactElement;
      breadcrumb: React.ReactElement;
      tabs: React.ReactElement;
    }>) => (
      <div>
        <div>{breadcrumb}</div>
        {message && <div>{message}</div>}
        {tabs && <div>{tabs}</div>}
        {children}
      </div>
    ),
    LinkCard: ({
      href,
      externalHref,
      description,
    }: React.PropsWithChildren<{
      externalHref: string;
      href: string;
      description: string;
    }>) => (
      <a
        href={href}
        target={externalHref ? '_blank' : undefined}
        rel={externalHref ? 'noreferrer' : undefined}
        className="no-underline"
      >
        {description}
      </a>
    ),
    OdsTabs: ({ children }: any) => <div>{children}</div>,
    OdsTab: ({ children }: any) => <div>{children}</div>,
    Error: ({ error }: { error: Error }) => (
      <div data-testid="error-component">{error.message}</div>
    ),
    RedirectionGuard: ({ condition, route, children }: any) =>
      condition ? <Navigate to={route} replace /> : <>{children}</>,
    OnboardingLayout: ({
      title,
      description,
      children,
      orderButtonLabel,
      onOrderButtonClick,
    }: React.PropsWithChildren<{
      title: string;
      children: React.ReactNode;
      description: string;
      orderButtonLabel?: string;
      onOrderButtonClick?: () => void;
    }>) => (
      <main>
        <section aria-labelledby="onboarding-title">
          {title}
          {description}
        </section>
        {orderButtonLabel && onOrderButtonClick && (
          <button
            onClick={onOrderButtonClick}
            data-testid="onboarding-order-button"
          >
            {orderButtonLabel}
          </button>
        )}
        {children && <div>{children}</div>}
      </main>
    ),
    useDataApi: vi.fn(() => ({
      flattenData: [],
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      filters: {},
      sorting: {},
    })),
  };
});

vi.mock('@ovh-ux/manager-core-api', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...mod,
    fetchIcebergV6: vi.fn(),
    apiClient: {
      v6: {
        get: vi.fn().mockResolvedValue({ data: [] }),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      },
      request: vi.fn(),
    },
  };
});
