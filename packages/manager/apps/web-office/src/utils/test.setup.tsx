import { vi } from 'vitest';
import { ResponsiveContainerProps } from 'recharts';
import {
  usersMock,
  licensesMock,
  licensesPrepaidMock,
  licensesPrepaidExpandedMock,
  pendingTask,
  tenantPendingTask,
  orderCatalogMock,
  priceMock,
  userDomainMock,
  mockOfficeLicenseServiceInfos,
  mockUsageStatistics,
  parentTenantMock,
} from '@/data/api/__mocks__';

const mocksAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
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

vi.mock('@/hooks', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/hooks')>()),
    useGenerateUrl: vi.fn(),
  };
});

vi.mock('@/data/api/serviceInfos', async (importActual) => {
  const actual = await importActual<typeof import('@/data/api/serviceInfos')>();
  return {
    ...actual,
    getOfficeLicenseServiceInfos: vi.fn(() =>
      Promise.resolve(mockOfficeLicenseServiceInfos),
    ),
  };
});
vi.mock('@/data/api/license', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/license')>()),
    getOfficeGlobalLicenses: vi.fn(() => Promise.resolve(licensesMock)),
    getOfficeLicenses: vi.fn(() => Promise.resolve(licensesMock)),
    getOfficeLicenseDetails: vi.fn((serviceName) =>
      Promise.resolve(
        [...licensesMock, ...licensesPrepaidExpandedMock].find(
          (license) => license.serviceName === serviceName,
        ),
      ),
    ),
    getOfficePrepaidLicenses: vi.fn(() => Promise.resolve(licensesPrepaidMock)),
    getOfficePrepaidLicenseDetails: vi.fn((serviceName) =>
      Promise.resolve(
        licensesPrepaidExpandedMock.find(
          (license) => license.serviceName === serviceName,
        ),
      ),
    ),
    postOfficePrepaidLicenseUnconfigure: vi.fn(() =>
      Promise.resolve(pendingTask),
    ),
    putOfficeLicenseDetails: vi.fn(() => Promise.resolve(null)),
  };
});

vi.mock('@/data/api/users', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/users')>()),
    deleteOfficeUser: vi.fn(() => Promise.resolve(tenantPendingTask)),
    getOfficeUsers: vi.fn(() => Promise.resolve(usersMock)),
    getOfficeUserDetail: vi.fn((_, activationEmail) =>
      Promise.resolve(
        usersMock.find((user) => user.activationEmail === activationEmail),
      ),
    ),
    getOfficeUsersDomain: vi.fn(() => Promise.resolve(userDomainMock)),
    postUsersPassword: vi.fn(() => Promise.resolve(null)),
    putOfficeUserDetail: vi.fn(() => Promise.resolve(null)),
    postOrderUsers: vi.fn(() => Promise.resolve(null)),
  };
});
vi.mock('@/data/api/order', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/order')>()),
    getOrderCatalog: vi.fn(() => {
      return Promise.resolve(orderCatalogMock);
    }),
  };
});

vi.mock('@/data/api/price', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/price')>()),
    getOfficePrice: vi.fn(() => Promise.resolve(priceMock)),
  };
});

vi.mock('@/data/api/usageStatistics', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/usageStatistics')>()),
    getOfficeUsageStatistics: vi.fn(() => Promise.resolve(mockUsageStatistics)),
    getOfficeTenantUsageStatistics: vi.fn(() =>
      Promise.resolve(mockUsageStatistics),
    ),
  };
});

vi.mock('@/data/api/parentTenant', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/parentTenant')>()),
    getParentTenant: vi.fn(() => {
      return Promise.resolve(parentTenantMock);
    }),
  };
});

vi.mock('@ovh-ux/manager-module-order', () => ({
  getExpressOrderURL: vi.fn(),
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
    useParams: vi.fn(() => []),
  };
});

vi.mock('recharts', async () => {
  const mockRecharts = await vi.importActual<typeof import('recharts')>(
    'recharts',
  );
  return {
    ...mockRecharts,
    ResponsiveContainer: ({ children }: ResponsiveContainerProps) => (
      <mockRecharts.ResponsiveContainer>
        {children}
      </mockRecharts.ResponsiveContainer>
    ),
  };
});
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

afterEach(() => {
  vi.clearAllMocks();
});
