import { Path, To } from 'react-router-dom';

import { vi } from 'vitest';

import {
  WebHostingWebsiteDomainMocks,
  WebHostingWebsiteMocks,
  WebHostingWebsiteV6Mock,
  attachedDomainDigStatusMock,
  domainInformationMock,
  domainZoneMock,
  serviceInfosMock,
  webHostingMock,
  websitesMocks,
} from '@/data/__mocks__';
import { cdnOptionMock, cdnPropertiesMock, serviceNameCdnMock } from '@/data/__mocks__/cdn';
import { managedWordpressRerefenceAvailableLanguageMock } from '@/data/__mocks__/managedWordpress/language';
import {
  managedWordpressResourceDetailsMock,
  managedWordpressResourceMock,
} from '@/data/__mocks__/managedWordpress/ressource';
import { managedWordpressRerefenceSupportedVersionMock } from '@/data/__mocks__/managedWordpress/supportedPhpVersion';
import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__/managedWordpress/tasks';
import {
  managedWordpressWebsitesDeleteMock,
  managedWordpressWebsitesDetailsMock,
  managedWordpressWebsitesMock,
} from '@/data/__mocks__/managedWordpress/website';

const mocksAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

export const deleteMock = vi.fn();

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ovh-ux/manager-core-api')>()),
  v6: {
    put: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    delete: deleteMock,
    fetchIcebergV2: vi.fn().mockResolvedValue({ data: {}, cursorNext: null }),
  },
}));

vi.mock('axios', async (importActual) => {
  const actual = await importActual<typeof import('axios')>();

  const mockAxios = {
    default: {
      ...actual.default,
      get: mocksAxios.get,
      post: mocksAxios.post,
      put: mocksAxios.put,
      delete: mocksAxios.delete,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocksAxios.get,
        post: mocksAxios.post,
        put: mocksAxios.put,
        delete: mocksAxios.delete,
      })),
    },
  };

  return mockAxios;
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('export-to-csv', () => ({
  generateCsv: () => vi.fn().mockReturnValue('csv-content'),
  mkConfig: vi.fn().mockReturnValue({ filename: 'websites.csv' }),
  download: vi.fn().mockImplementation(() => vi.fn()),
}));

/* eslint-disable react/no-multi-comp */
vi.mock('@ovh-ux/muk', () => {
  return {
    Datagrid: ({
      columns,
      topbar,
      ...props
    }: React.PropsWithChildren<{
      columns?: Array<{ id: string; header?: string }>;
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
    Notifications: ({
      message,
    }: React.PropsWithChildren<{
      message?: string;
    }>) => <div>{message}</div>,
    ActionMenu: ({
      id,
      items,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      items?: Array<{ id: number; label: string }>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="action-menu" data-id={id} {...props}>
        {items?.map((item) => (
          <button key={item.id} data-testid={`action-item-${item.id}`}>
            {item.label}
          </button>
        ))}
      </div>
    ),
    ChangelogMenu: ({
      id,
      links,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      links?: Array<{ id: number; label: string }>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="action-menu" data-id={id} {...props}>
        {links?.map((item) => (
          <button key={item.id} data-testid={`action-item-${item.id}`}>
            {item.label}
          </button>
        ))}
      </div>
    ),
    Modal: ({
      children,
      primaryButton,
      secondaryButton,
    }: React.PropsWithChildren<{
      children: React.ReactNode;
      primaryButton?: { label: string; disabled: boolean; onClick: () => void };
      secondaryButton?: { label: string; disabled: boolean; onClick: () => void };
    }>) => (
      <div data-testid="modal">
        {children}
        {primaryButton && (
          <button
            data-testid="primary-button"
            onClick={primaryButton.onClick}
            disabled={primaryButton.disabled}
          >
            {primaryButton.label}
          </button>
        )}
        {secondaryButton && (
          <button
            data-testid="secondary-button"
            onClick={secondaryButton.onClick}
            disabled={secondaryButton.disabled}
          >
            {secondaryButton.label}
          </button>
        )}
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
    OnboardingLayout: ({
      title,
      description,
      children,
    }: React.PropsWithChildren<{
      title: string;
      children: React.ReactNode;
      description: string;
    }>) => (
      <main>
        <section aria-labelledby="onboarding-title">
          {title}
          {description}
        </section>
        {children && <div>{children}</div>}
      </main>
    ),
    Badge: ({
      children,
      itemStatus,
      statusColor,
    }: React.PropsWithChildren<{
      children: React.ReactNode;
      itemStatus: string;
      statusColor: string;
    }>) => (
      <div>
        <span data-testid={`badge-status-${itemStatus}`} color={statusColor}>
          {children}
        </span>
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
    MODAL_COLOR: {
      critical: 'critical',
      information: 'information',
      neutral: 'neutral',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
    },
    BADGE_COLOR: {
      alpha: 'alpha',
      beta: 'beta',
      new: 'new',
      promotion: 'promotion',
      critical: 'critical',
      information: 'information',
      neutral: 'neutral',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
    },
    useNotifications: vi.fn(() => ({
      addSuccess: vi.fn(),
      addError: vi.fn(),
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    })),
    useDataApi: vi.fn(() => ({
      flattenData: [],
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      filters: {},
      sorting: {},
    })),
    useFormatDate: vi.fn((date: string) => `formatted-${date}`),
  };
});
/* eslint-enable react/no-multi-comp */

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
        }) as Record<string, string | undefined>,
    ),
  };
});
vi.mock('@/data/api/local-seo', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/api/local-seo')>();
  return {
    ...actual,
    hostingLocalSeoLogin: vi.fn().mockResolvedValue('tokenValue'),
    hostingDeleteLocation: vi.fn().mockResolvedValue('OK'),
  };
});
vi.mock('@/data/api/webHosting', () => ({
  getWebHostingAttachedDomain: vi.fn().mockResolvedValue({
    data: websitesMocks,
    cursorNext: null,
  }),
  getWebHostingAttachedDomainQueryKey: vi.fn(),
  getWebHostingAttachedDomainDigStatus: vi.fn(() => Promise.resolve(attachedDomainDigStatusMock)),
  getWebHostingAttachedDomainDigStatusQueryKey: vi.fn(),
  getManagedCmsResourceWebsiteDetailsQueryKey: vi.fn(),
  getWebHostingWebsite: vi.fn(() => Promise.resolve(WebHostingWebsiteMocks)),
  getWebHostingWebsiteDomain: vi.fn(() => Promise.resolve(WebHostingWebsiteDomainMocks)),
  getWebHostingWebsiteDomainQueryKey: vi.fn(),
  useWebHostingWebsite: vi.fn(),
  useWebHostingWebsiteDomain: vi.fn(),
  deleteAttachedDomains: vi.fn(),
  getWebHostingWebsiteV6: vi.fn(() => Promise.resolve(WebHostingWebsiteV6Mock)),
}));

vi.mock('@/data/api/dashboard', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/dashboard')>()),
    getHostingService: vi.fn(() => Promise.resolve(webHostingMock)),
    getDomainZone: vi.fn(() => Promise.resolve(domainZoneMock)),
    getServiceInfos: vi.fn(() => Promise.resolve(serviceInfosMock)),
    getDomainService: vi.fn(() => Promise.resolve(domainInformationMock)),
  };
});
vi.mock('@/data/api/git', () => ({
  deleteGitAssociation: vi.fn(),
}));

vi.mock('@/data/api/cdn', () => ({
  getCDNProperties: vi.fn(() => Promise.resolve(cdnPropertiesMock)),
}));

vi.mock('@/data/hooks/cdn', () => ({
  useGetCDNProperties: vi.fn(),
  flushCDNDomainCache: vi.fn(),
  flushCdn: vi.fn(),
}));

vi.mock('@/data/hooks/cdn/useCdn', async (importActual) => {
  const actual = await importActual<typeof import('@/data/hooks/cdn/useCdn')>();
  return {
    ...actual,
    useGetServiceNameCdn: vi.fn(() => ({
      data: serviceNameCdnMock,
      isSuccess: true,
    })),
    useGetCdnOption: vi.fn(() => ({
      data: cdnOptionMock,
      isSuccess: true,
    })),
  };
});

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useCreateAttachedDomainsService: vi.fn(),
  useGetAddDomainExisting: vi.fn(),
  useGetDomainZone: vi.fn(),
  useGetHostingService: vi.fn(),
  useGetHostingServiceWebsite: vi.fn(),
}));

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', async (importActual) => {
  const actual =
    await importActual<typeof import('@/data/hooks/webHostingDashboard/useWebHostingDashboard')>();
  return {
    ...actual,
    useGetServiceInfos: vi.fn(() => ({
      data: serviceInfosMock,
      isSuccess: true,
      isLoading: false,
      isError: false,
      status: 'success',
    })),
  };
});

vi.mock('@/data/api/managedWordpress', () => ({
  getManagedCmsResource: vi.fn(() => Promise.resolve(managedWordpressResourceMock)),
  getManagedCmsResourceDetails: vi.fn(() => Promise.resolve(managedWordpressResourceDetailsMock)),
  getManagedCmsResourceWebsites: vi.fn(() => Promise.resolve(managedWordpressWebsitesMock)),
  getAllManagedCmsResourceWebsites: vi.fn(() => Promise.resolve(managedWordpressWebsitesMock)),
  getManagedCmsResourceWebsiteDetails: vi.fn(() =>
    Promise.resolve(managedWordpressWebsitesDetailsMock),
  ),
  deleteManagedCmsResourceWebsite: vi.fn(() => Promise.resolve(managedWordpressWebsitesDeleteMock)),
  getManagedCmsResourceWebsiteTasks: vi.fn(() => Promise.resolve(managedWordpressWebsitesTaskMock)),
  getManagedCmsReferenceAvailableLanguages: vi.fn(() =>
    Promise.resolve(managedWordpressRerefenceAvailableLanguageMock),
  ),
  getManagedCmsSupportedPHPVersions: vi.fn(() =>
    Promise.resolve(managedWordpressRerefenceSupportedVersionMock),
  ),
  getManagedCmsResourceWebsiteDetailsQueryKey: vi.fn(),
  getManagedCmsResourceWebsitesQueryKey: vi.fn(),
}));
afterEach(() => {
  vi.clearAllMocks();
});

vi.mock(
  '@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain',
  async (importActual) => {
    const actual =
      await importActual<
        typeof import('@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain')
      >();
    return {
      ...actual,
      useWebHostingAttachedDomain: vi.fn(() => ({
        data: websitesMocks,
        isSuccess: true,
        isLoading: false,
        isError: false,
        status: 'success',
      })),
    };
  },
);
