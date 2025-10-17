import React from 'react';

import { Path, To } from 'react-router-dom';

import { vi } from 'vitest';

import {
  attachedDomainDigStatusMock,
  domainInformationMock,
  domainZoneMock,
  serviceInfosMock,
  webHostingMock,
  websitesMocks,
} from '../data/__mocks__';

const mocksAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

const mocksHostingUrl = vi.hoisted(() => ({
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('test-url'),
    },
  },
  environment: {
    getRegion: () => 'FR',
    getUser: () => ({ ovhSubsidiary: 'FR' }),
  },
}));

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ovh-ux/manager-core-api')>()),
  v6: {
    put: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn(),
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

vi.mock('@ovh-ux/manager-react-shell-client', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...actual,
    ShellContext: React.createContext(mocksHostingUrl),
    useContext: React.useContext,
    useOvhTracking: vi.fn(() => {
      return {
        trackClick: vi.fn(),
        trackPage: vi.fn(),
        trackCurrentPage: vi.fn(),
      };
    }),
    PageLocation: {
      page: 'page',
      tile: 'tile',
    },
    ButtonType: {
      button: 'button',
      externalLink: 'externalLink',
    },
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@ovh-ux/manager-react-components')>()),
    useNotifications: () => ({
      addSuccess: vi.fn(),
      addWarning: vi.fn(),
    }),
  };
});

vi.mock('export-to-csv', () => ({
  generateCsv: () => vi.fn().mockReturnValue('csv-content'),
  mkConfig: vi.fn().mockReturnValue({ filename: 'websites.csv' }),
  download: vi.fn().mockImplementation(() => vi.fn()),
}));

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

vi.mock('@/data/api/index', () => ({
  getWebHostingAttachedDomain: vi.fn().mockResolvedValue({
    data: websitesMocks,
    cursorNext: null,
  }),
  getWebHostingAttachedDomainQueryKey: vi.fn(),
  getWebHostingAttachedDomainDigStatus: vi.fn(() => Promise.resolve(attachedDomainDigStatusMock)),
  getWebHostingAttachedDomainDigStatusQueryKey: vi.fn(),
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

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useCreateAttachedDomainsService: vi.fn(),
  useGetAddDomainExisting: vi.fn(),
  useGetDomainZone: vi.fn(),
  useGetHostingService: vi.fn(),
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

afterEach(() => {
  vi.clearAllMocks();
});
