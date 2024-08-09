import { vi } from 'vitest';
import {
  accountsMock,
  domainsMock,
  mailingListsMock,
  organizationListMock,
  platformMock,
  taskMocks,
  aliasMock,
  domainZone,
} from '@/api/_mock_';
import { AccountType } from '@/api/account';
import { DomainType } from '@/api/domain';

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

vi.mock('@/api/account', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/account')>()),
    getZimbraPlatformAccountDetail: vi.fn((_platformId, accountId) => {
      return Promise.resolve(
        accountsMock.find((acc: AccountType) => acc.id === accountId),
      );
    }),
    getZimbraPlatformAccounts: vi.fn(() => {
      return Promise.resolve({
        data: accountsMock,
      });
    }),
    deleteZimbraPlatformAccount: vi.fn(() => {
      return Promise.resolve();
    }),
  };
});

vi.mock('@/api/domain', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/domain')>()),
    getZimbraPlatformDomainDetail: vi.fn((_platformId, domainId) => {
      return Promise.resolve(
        domainsMock.find((dom: DomainType) => dom.id === domainId),
      );
    }),
    getZimbraPlatformDomains: vi.fn(() => {
      return Promise.resolve({
        data: domainsMock,
      });
    }),
    getDomainsZoneList: vi.fn(() => {
      return Promise.resolve(domainZone);
    }),
    putZimbraDomain: vi.fn(() => {
      return Promise.resolve();
    }),
    deleteZimbraPlatformDomain: vi.fn(() => {
      return Promise.resolve();
    }),
  };
});

vi.mock('@/api/alias', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/alias')>()),
    getZimbraPlatformAliasDetail: vi.fn((_platformId, aliasId) => {
      return Promise.resolve(aliasMock.find((alias) => alias.id === aliasId));
    }),
    getZimbraPlatformAlias: vi.fn(() => {
      return Promise.resolve(aliasMock);
    }),
    deleteZimbraPlatformAlias: vi.fn(() => {
      return Promise.resolve();
    }),
  };
});

vi.mock('@/api/mailinglist', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/mailinglist')>()),
    getZimbraPlatformMailingListDetails: vi.fn((_platformId, mlId) => {
      return Promise.resolve(mailingListsMock.find((ml) => ml.id === mlId));
    }),
    getZimbraPlatformMailingLists: vi.fn(() => {
      return Promise.resolve(mailingListsMock);
    }),
  };
});

vi.mock('@/api/organization', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/organization')>()),
    getZimbraPlatformOrganizationDetails: vi.fn((_platformId, orgId) => {
      return Promise.resolve(
        organizationListMock.find((org) => org.id === orgId),
      );
    }),
    getZimbraPlatformOrganization: vi.fn(() => {
      return Promise.resolve({
        data: organizationListMock,
      });
    }),
    postZimbraPlatformOrganization: vi.fn(() => {
      return Promise.resolve();
    }),
    putZimbraPlatformOrganization: vi.fn(() => {
      return Promise.resolve();
    }),
    deleteZimbraPlatformOrganization: vi.fn(() => {
      return Promise.resolve();
    }),
  };
});

vi.mock('@/api/platform', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/platform')>()),
    getZimbraPlatformList: vi.fn(() => {
      return Promise.resolve(platformMock);
    }),
  };
});

vi.mock('@/api/task', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/api/task')>()),
    getZimbraPlatformTask: vi.fn(() => {
      return Promise.resolve(taskMocks);
    }),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  return {
    ...(await importOriginal<
      typeof import('@ovh-ux/manager-react-components')
    >()),
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
