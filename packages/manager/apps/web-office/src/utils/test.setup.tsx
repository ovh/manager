import { vi } from 'vitest';
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
} from '@/api/_mock_';

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

vi.mock('@/api/license', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/license')>()),
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

vi.mock('@/api/users', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/users')>()),
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
vi.mock('@/api/order', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/order')>()),
    getOrderCatalog: vi.fn(() => {
      return Promise.resolve(orderCatalogMock);
    }),
  };
});

vi.mock('@/api/price', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/price')>()),
    getOfficePrice: vi.fn(() => Promise.resolve(priceMock)),
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

afterEach(() => {
  vi.clearAllMocks();
});
