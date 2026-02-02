import React from 'react';

import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { ResponsiveContainerProps } from 'recharts';
import { afterEach, vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import countriesCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/countries/Messages_fr_FR.json';
import dashboardCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import formCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/form/Messages_fr_FR.json';
import languageCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/language/Messages_fr_FR.json';
import statusCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';
import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';

import {
  licensesMock,
  licensesPrepaidExpandedMock,
  licensesPrepaidMock,
  tenantPendingTask,
} from '@/data/api/__mocks__/license';
import { orderCatalogMock } from '@/data/api/__mocks__/order';
import { parentTenantMock } from '@/data/api/__mocks__/parentTenant';
import { priceMock } from '@/data/api/__mocks__/price';
import { mockOfficeLicenseServiceInfos } from '@/data/api/__mocks__/serviceInfos';
import { mockUsageStatistics } from '@/data/api/__mocks__/usageStatistics';
import { pendingTask, userDomainMock, usersMock } from '@/data/api/__mocks__/user';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import consumptionTranslation from '@/public/translations/dashboard/consumption/Messages_fr_FR.json';
import dashboardGeneralInformationTranslation from '@/public/translations/dashboard/general-information/Messages_fr_FR.json';
import dashboardMcaTranslations from '@/public/translations/dashboard/microsoft-customer-agreement/Messages_fr_FR.json';
import dashboardUsersTranslation from '@/public/translations/dashboard/users/Messages_fr_FR.json';
import dashboardUsersOrderLicensesTranslation from '@/public/translations/dashboard/users/order-licenses/Messages_fr_FR.json';
import dashboardUsersOrderUsersTranslation from '@/public/translations/dashboard/users/order-users/Messages_fr_FR.json';
import licensesTranslation from '@/public/translations/licenses/Messages_fr_FR.json';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      licenses: licensesTranslation,
      'dashboard/general-information': dashboardGeneralInformationTranslation,
      'dashboard/users': dashboardUsersTranslation,
      'dashboard/microsoft-customer-agreement': dashboardMcaTranslations,
      'dashboard/consumption': consumptionTranslation,
      'dashboard/users/order-licenses': dashboardUsersOrderLicensesTranslation,
      'dashboard/users/order-users': dashboardUsersOrderUsersTranslation,
      onboarding: onboardingTranslation,
      common: commonTranslation,
      [NAMESPACES.ACTIONS]: actionsCommonTranslation,
      [NAMESPACES.STATUS]: statusCommonTranslation,
      [NAMESPACES.DASHBOARD]: dashboardCommonTranslation,
      [NAMESPACES.FORM]: formCommonTranslation,
      [NAMESPACES.COUNTRIES]: countriesCommonTranslation,
      [NAMESPACES.LANGUAGE]: languageCommonTranslation,
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

vi.mock('@ovh-ux/manager-module-common-api', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/manager-module-common-api')>();
  return {
    ...actual,
    useFeatureAvailability: vi.fn(),
  };
});

vi.mock('@/hooks/generate-url/useGenerateUrl', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/hooks/generate-url/useGenerateUrl')>()),
    useGenerateUrl: vi.fn(),
  };
});

vi.mock('@/data/api/service-infos/api', async (importActual) => {
  const actual = await importActual<typeof import('@/data/api/service-infos/api')>();
  return {
    ...actual,
    getOfficeLicenseServiceInfos: vi.fn(() => Promise.resolve(mockOfficeLicenseServiceInfos)),
  };
});
vi.mock('@/data/api/license/api', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/license/api')>()),
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
        licensesPrepaidExpandedMock.find((license) => license.serviceName === serviceName),
      ),
    ),
    postOfficePrepaidLicenseUnconfigure: vi.fn(() => Promise.resolve(pendingTask)),
    putOfficeLicenseDetails: vi.fn(() => Promise.resolve(null)),
  };
});

vi.mock('@/data/api/users/api', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/users/api')>()),
    deleteOfficeUser: vi.fn(() => Promise.resolve(tenantPendingTask)),
    getOfficeUsers: vi.fn(() => Promise.resolve(usersMock)),
    getOfficeUserDetail: vi.fn((_, activationEmail) =>
      Promise.resolve(usersMock.find((user) => user.activationEmail === activationEmail)),
    ),
    getOfficeUsersDomain: vi.fn(() => Promise.resolve(userDomainMock)),
    postUsersPassword: vi.fn(() => Promise.resolve(null)),
    putOfficeUserDetail: vi.fn(() => Promise.resolve(null)),
    postOrderUsers: vi.fn(() => Promise.resolve(null)),
  };
});

vi.mock('@/data/api/order/api', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/order/api')>()),
    getOrderCatalog: vi.fn(() => {
      return Promise.resolve(orderCatalogMock);
    }),
  };
});

vi.mock('@/data/api/price/api', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/price/api')>()),
    getOfficePrice: vi.fn(() => Promise.resolve(priceMock)),
  };
});

vi.mock('@/data/api/usage-statistics/api', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/usage-statistics/api')>()),
    getOfficeUsageStatistics: vi.fn(() => Promise.resolve(mockUsageStatistics)),
    getOfficeTenantUsageStatistics: vi.fn(() => Promise.resolve(mockUsageStatistics)),
  };
});

vi.mock('@/data/api/parent-tenant/api', async (importActual) => {
  return {
    ...(await importActual<typeof import('@/data/api/parent-tenant/api')>()),
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
      page: 'page',
      tile: 'tile',
    },
    ButtonType: {
      button: 'button',
      externalLink: 'externalLink',
    },
  };
});

vi.mock('recharts', async () => {
  const mockRecharts = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...mockRecharts,
    ResponsiveContainer: ({ children }: ResponsiveContainerProps) => (
      <mockRecharts.ResponsiveContainer>{children}</mockRecharts.ResponsiveContainer>
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
