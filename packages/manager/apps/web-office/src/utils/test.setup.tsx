import { vi } from 'vitest';
import { licensesMock } from '@/api/_mock_/license';
import { useOfficeLicenses } from '@/hooks';

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
    useOfficeLicenses: vi.fn(() => ({
      data: licensesMock,

      totalCount: licensesMock.length,
      isLoading: false,
      sorting: {},
      setSorting: vi.fn(),
      pageIndex: 1,
    })),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();

  return {
    ...actual,
    useResourcesIcebergV6: vi.fn(() => ({
      flattenData: licensesMock,
      isError: false,
      error: null,
      totalCount: licensesMock.length,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      sorting: {},
      setSorting: vi.fn(),
      pageIndex: 1,
    })),
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
