import { vi } from 'vitest';
import {
  usersMock,
  licensesMock,
  licensesPrepaidMock,
  licensesPrepaidExpandedMock,
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
    getOfficeGlobalLicenses: vi.fn(() => {
      return Promise.resolve(licensesMock);
    }),
    getOfficeLicenses: vi.fn(() => {
      return Promise.resolve(licensesMock);
    }),
    getOfficeLicenseDetails: vi.fn((serviceName) => {
      return Promise.resolve(
        licensesMock.find((license) => license.serviceName === serviceName),
      );
    }),
    getOfficePrepaidLicenses: vi.fn(() => {
      return Promise.resolve(licensesPrepaidMock);
    }),
    getOfficePrepaidLicenseDetails: vi.fn((serviceName) => {
      return Promise.resolve(
        licensesPrepaidExpandedMock.find(
          (license) => license.serviceName === serviceName,
        ),
      );
    }),
  };
});

vi.mock('@/api/users', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/users')>()),
    getOfficeUsers: vi.fn(() => {
      return Promise.resolve(usersMock);
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
  };
});

afterEach(() => {
  vi.clearAllMocks();
});
