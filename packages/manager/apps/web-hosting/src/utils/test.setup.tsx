/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/purity */
/* eslint-disable max-lines */
import { Path, To } from 'react-router-dom';

import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { afterEach, vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import countriesCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/countries/Messages_fr_FR.json';
import dashboardCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import formCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/form/Messages_fr_FR.json';
import languageCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/language/Messages_fr_FR.json';
import statusCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';
import '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';
import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';

import {
  WebHostingWebsiteDomainMocks,
  WebHostingWebsiteMocks,
  WebHostingWebsiteV6Mock,
  attachedDomainDigStatusMock,
  domainInformationMock,
  domainZoneMock,
  publicServiceMock,
  serviceDetailsMock,
  serviceInfosMock,
  sshKeyMock,
  vcsWebhookUrlsMock,
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
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import multisiteTranslation from '@/public/translations/multisite/Messages_fr_FR.json';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      common: commonTranslation,
      dashboard: dashboardTranslation,
      onboarding: onboardingTranslation,
      multisite: multisiteTranslation,
      [NAMESPACES.ACTIONS]: actionsCommonTranslation,
      [NAMESPACES.STATUS]: statusCommonTranslation,
      [NAMESPACES.DASHBOARD]: dashboardCommonTranslation,
      [NAMESPACES.FORM]: formCommonTranslation,
      [NAMESPACES.COUNTRIES]: countriesCommonTranslation,
      [NAMESPACES.LANGUAGE]: languageCommonTranslation,
    },
  },
  ns: ['common', 'onboarding', 'multisite', 'dashboard'],
});

const mocksAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

const mockUseDataApi = vi.hoisted(() => vi.fn());
export const getDomRect = (width: number, height: number): DOMRect => ({
  width,
  height,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: vi.fn(),
});

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

vi.mock('@ovh-ux/muk', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/muk')>();
  const formatDateMock = vi.fn(({ date }: { date: string }) => date);
  return {
    ...actual,
    useDataApi: mockUseDataApi,
    useNotifications: vi.fn(() => ({
      notifications: [],
      addSuccess: vi.fn(),
      addError: vi.fn(),
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    })),
    useFormatDate: vi.fn(() => formatDateMock),
  };
});

mockUseDataApi.mockReturnValue({
  flattenData: [],
  isLoading: false,
  isError: false,
  error: null,
  isSuccess: true,
  isFetching: false,
  status: 'success',
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  pageIndex: 0,
  totalCount: 0,
});
vi.mock('@ovh-ux/manager-react-shell-client', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...actual,
    useOvhTracking: vi.fn(() => {
      return {
        trackClick: vi.fn(),
        trackPage: vi.fn(),
        trackCurrentPage: vi.fn(),
      };
    }),
    PageLocation: {
      ...actual.PageLocation,
    },
    ButtonType: {
      ...actual.ButtonType,
    },
  };
});

export const navigate = vi.fn();
export { mockUseDataApi, mockUseInfiniteQuery };

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
          serviceName: 'test-service',
          domain: 'test-domain.com',
          path: '/public_html',
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
    getSshKey: vi.fn(() => Promise.resolve(sshKeyMock)),
    getVcsWebhookUrls: vi.fn(() => Promise.resolve(vcsWebhookUrlsMock)),
    getServiceDetails: vi.fn(() => Promise.resolve(serviceDetailsMock)),
  };
});
vi.mock('@/data/api/git', () => ({
  deleteGitAssociation: vi.fn(),
  fetchHostingWebsiteIds: vi.fn().mockResolvedValue([1, 2, 3]),
  fetchWebsiteDeployments: vi.fn().mockResolvedValue([1, 2, 3]),
  fetchDeploymentLogs: vi.fn().mockResolvedValue([{ id: 1, message: 'test' }]),
  postWebsiteDeploy: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/data/api/cdn', () => ({
  createCdnOption: vi.fn().mockResolvedValue(undefined),
  updateCdnOption: vi.fn().mockResolvedValue(undefined),
  updateCdnOptions: vi.fn().mockResolvedValue(undefined),
  deleteCdnOption: vi.fn().mockResolvedValue(undefined),
  getCDNProperties: vi.fn(() => Promise.resolve(cdnPropertiesMock)),
}));

vi.mock('@/data/api/videoCenter', () => ({
  getServiceVideoCenter: vi.fn(() => Promise.resolve(publicServiceMock)),
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
  useGetSshKey: vi.fn(),
  useGetVcsWebhookUrls: vi.fn(),
  useGetServiceDetails: vi.fn(),
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
  getManagedCmsResourceWebsites: vi.fn(() =>
    Promise.resolve({
      data: managedWordpressWebsitesMock,
      cursorNext: null,
      status: 200,
    }),
  ),
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
  postManagedCmsResourceWebsite: vi.fn(() => Promise.resolve({ id: 'mock-website-id' })),
  putManagedCmsResourceWebsiteTasks: vi.fn(() => Promise.resolve({ id: 'mock-task-id' })),
}));

const mockUseInfiniteQuery = vi.fn();

vi.mock('@tanstack/react-query', async (importActual) => {
  const actual = await importActual<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useInfiniteQuery: mockUseInfiniteQuery,
  };
});

export const mockInfiniteQueryResult = {
  data: managedWordpressWebsitesMock,
  status: 'success' as const,
  isSuccess: true,
  isError: false,
  error: null,
  isPending: false,
  isLoading: false,
  isLoadingError: false,
  isRefetchError: false,
  isRefetching: false,
  isFetching: false,
  isFetchingNextPage: false,
  isFetchingPreviousPage: false,
  hasNextPage: false,
  hasPreviousPage: false,
  fetchNextPage: vi.fn(),
  fetchPreviousPage: vi.fn(),
  refetch: vi.fn(),
  remove: vi.fn(),
  pages: [
    {
      data: managedWordpressWebsitesMock,
      cursorNext: null,
      status: 200,
    },
  ],
  pageParams: [null],
};

mockUseInfiniteQuery.mockReturnValue(
  mockInfiniteQueryResult as unknown as ReturnType<typeof mockUseInfiniteQuery>,
);
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
type SelectItem = { value?: string; label?: string };

vi.mock('@ovhcloud/ods-react', async (importActual) => {
  const actual = await importActual<typeof import('@ovhcloud/ods-react')>();
  const MockSelect = ({
    items = [],
    value,
    onValueChange,
    ...rest
  }: {
    items?: SelectItem[];
    value?: string[];
    onValueChange?: (detail: { value: string[] }) => void;
    [key: string]: unknown;
  }) => {
    const selectValue =
      Array.isArray(value) && value.length > 0 ? value[0] : typeof value === 'string' ? value : '';
    const { 'data-testid': dataTestId, ...selectProps } = rest;
    return (
      <select
        data-testid={dataTestId as string}
        value={selectValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          onValueChange?.({ value: nextValue ? [nextValue] : [] });
        }}
        {...selectProps}
      >
        <option value="" label=" " />
        {items.map((item) => (
          <option
            key={item.value ?? item.label ?? `option-${Math.random()}`}
            value={item.value}
            label={item.label}
          >
            {item.label}
          </option>
        ))}
      </select>
    );
  };

  const MockSelectControl = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
  const MockSelectContent = () => null;

  return {
    ...actual,
    Select: MockSelect,
    SelectControl: MockSelectControl,
    SelectContent: MockSelectContent,
  };
});

vi.mock('@/data/hooks/videoCenter/useVideoCenter', async (importActual) => {
  const actual = await importActual<typeof import('@/data/hooks/videoCenter/useVideoCenter')>();
  return {
    ...actual,
    useVideoCenter: vi.fn(() => ({
      data: publicServiceMock,
      isSuccess: true,
      isLoading: false,
      isError: false,
      status: 'success',
    })),
  };
});
