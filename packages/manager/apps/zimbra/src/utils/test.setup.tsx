import { vi } from 'vitest';

import {
  AccountType,
  DomainType,
  accountsMock,
  aliasesMock,
  domainZone,
  domainsDiagnosticMock,
  domainsMock,
  mailingListsMock,
  orderCatalogMock,
  organizationsMock,
  platformMock,
  serviceMock,
  servicesMock,
  slotMock,
  slotServicesMock,
  slotsMock,
  taskMocks,
} from '@/data/api';

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

vi.mock('@ovh-ux/manager-react-shell-client', async (importActual) => {
  return {
    ...(await importActual<typeof import('@ovh-ux/manager-react-shell-client')>()),
    useOvhTracking: vi.fn(() => {
      return {
        trackClick: vi.fn(),
        trackPage: vi.fn(),
        trackCurrentPage: vi.fn(),
      };
    }),
  };
});

vi.mock('@/data/api', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api')>()),
    // ACCOUNT
    getZimbraPlatformAccountDetail: vi.fn((_platformId, accountId) => {
      return Promise.resolve(accountsMock.find((acc: AccountType) => acc.id === accountId));
    }),
    getZimbraPlatformAccounts: vi.fn(() => {
      return Promise.resolve({
        data: accountsMock,
      });
    }),
    deleteZimbraPlatformAccount: vi.fn(() => {
      return Promise.resolve();
    }),
    // DOMAIN
    getZimbraPlatformDomainDetail: vi.fn((_platformId, domainId) => {
      return Promise.resolve(domainsMock.find((dom: DomainType) => dom.id === domainId));
    }),
    getZimbraPlatformDomains: vi.fn(() => {
      return Promise.resolve({
        data: domainsMock,
      });
    }),
    getDomainsZoneList: vi.fn(() => {
      return Promise.resolve(domainZone);
    }),
    getDomainZoneByName: vi.fn(() => {
      return Promise.resolve(domainZone);
    }),
    postZimbraPlatformDomainsDiagnostic: vi.fn(() => {
      return Promise.resolve(domainsDiagnosticMock);
    }),
    putZimbraDomain: vi.fn(() => {
      return Promise.resolve();
    }),
    deleteZimbraPlatformDomain: vi.fn(() => {
      return Promise.resolve();
    }),
    // ALIAS
    getZimbraPlatformAlias: vi.fn((_platformId, aliasId) => {
      return Promise.resolve(aliasesMock.find((alias) => alias.id === aliasId));
    }),
    getZimbraPlatformAliases: vi.fn(() => {
      return Promise.resolve({ data: aliasesMock });
    }),
    deleteZimbraPlatformAlias: vi.fn(() => {
      return Promise.resolve();
    }),
    postZimbraPlatformAlias: vi.fn(() => {
      return Promise.resolve();
    }),
    // MAILING LIST
    getZimbraPlatformMailingListDetails: vi.fn((_platformId, mlId) => {
      return Promise.resolve(mailingListsMock.find((ml) => ml.id === mlId));
    }),
    getZimbraPlatformMailingLists: vi.fn(() => {
      return Promise.resolve({ data: mailingListsMock });
    }),
    // ORGANIZATION
    getZimbraPlatformOrganizationDetails: vi.fn((_platformId, orgId) => {
      return Promise.resolve(organizationsMock.find((org) => org.id === orgId));
    }),
    getZimbraPlatformOrganization: vi.fn(() => {
      return Promise.resolve({
        data: organizationsMock,
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
    // PLATFORM
    getZimbraPlatformList: vi.fn(() => {
      return Promise.resolve(platformMock);
    }),
    // TASK
    getZimbraPlatformTask: vi.fn(() => {
      return Promise.resolve(taskMocks);
    }),
    // SLOT
    getZimbraPlatformSlots: vi.fn(() => {
      return Promise.resolve({ data: slotsMock });
    }),
    getZimbraPlatformSlot: vi.fn(() => {
      return Promise.resolve(slotMock);
    }),
    // SERVICES
    getServices: vi.fn(() => {
      return Promise.resolve({ data: servicesMock });
    }),
    getSlotServices: vi.fn(() => {
      return Promise.resolve(slotServicesMock);
    }),
    getServiceByResourceName: vi.fn(() => {
      return Promise.resolve(serviceMock);
    }),
    // ORDER
    getOrderCatalog: vi.fn(() => {
      return Promise.resolve(orderCatalogMock);
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
    useParams: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});
