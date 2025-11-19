import '@testing-library/jest-dom';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

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
  redirectionsMock,
  serviceMock,
  servicesMock,
  slotMock,
  slotServicesMock,
  slotsMock,
  taskMocks,
  zimbraUpgradeOrderMock,
} from '@/data/api';
import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import accountAliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import accountFormTranslation from '@/public/translations/accounts/form/Messages_fr_FR.json';
import accountOrderTranslation from '@/public/translations/accounts/order/Messages_fr_FR.json';
import autoRepliesTranslation from '@/public/translations/auto-replies/Messages_fr_FR.json';
import autoRepliesFormTranslation from '@/public/translations/auto-replies/form/Messages_fr_FR.json';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import domainsTranslation from '@/public/translations/domains/Messages_fr_FR.json';
import domainsDiagnosticTranslation from '@/public/translations/domains/diagnostic/Messages_fr_FR.json';
import domainsFormTranslation from '@/public/translations/domains/form/Messages_fr_FR.json';
import mailingListsTranslation from '@/public/translations/mailing-lists/Messages_fr_FR.json';
import mailingListsFormTranslation from '@/public/translations/mailing-lists/form/Messages_fr_FR.json';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';
import organizationsFormTranslation from '@/public/translations/organizations/form/Messages_fr_FR.json';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';

await i18next.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      common: commonTranslation,
      dashboard: dashboardTranslation,
      organizations: organizationsTranslation,
      'organizations/form': organizationsFormTranslation,
      domains: domainsTranslation,
      'domains/form': domainsFormTranslation,
      'domains/diagnostic': domainsDiagnosticTranslation,
      accounts: accountTranslation,
      'accounts/form': accountFormTranslation,
      'accounts/alias': accountAliasTranslation,
      'accounts/order': accountOrderTranslation,
      'mailing-lists': mailingListsTranslation,
      'mailing-lists/form': mailingListsFormTranslation,
      redirections: redirectionsTranslation,
      'auto-replies': autoRepliesTranslation,
      'auto-replies/form': autoRepliesFormTranslation,
      onboarding: onboardingTranslation,
      [NAMESPACES.ACTIONS]: actionsCommonTranslation,
    },
  },
  ns: ['dashboard'],
});

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
    // REDIRECTION
    getZimbraPlatformRedirections: vi.fn(() => {
      return Promise.resolve({
        data: redirectionsMock,
      });
    }),
    getZimbraPlatformRedirection: vi.fn(() => {
      return Promise.resolve(redirectionsMock[0]);
    }),
    postZimbraPlatformRedirection: vi.fn(() => {
      return Promise.resolve();
    }),
    deleteZimbraPlatformRedirection: vi.fn(() => {
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
    getZimbraUpgradeOrder: vi.fn(() => {
      return Promise.resolve(zimbraUpgradeOrderMock);
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

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}

window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});
