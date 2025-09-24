import React from 'react';

import { Path, To } from 'react-router-dom';

import { vi } from 'vitest';

import { attachedDomainDigStatusMock, websitesMocks } from '@/data/__mocks__';
import { managedWordpressRerefenceAvailableLanguageMock } from '@/data/__mocks__/managedWordpress/language';
import {
  managedWordpressResourceDetailsMock,
  managedWordpressResourceMock,
} from '@/data/__mocks__/managedWordpress/ressource';
import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__/managedWordpress/tasks';
import {
  managedWordpressWebsitesDeleteMock,
  managedWordpressWebsitesDetailsMock,
  managedWordpressWebsitesMock,
} from '@/data/__mocks__/managedWordpress/website';

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
}));

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ovh-ux/manager-core-api')>()),
  v6: {
    put: vi.fn().mockResolvedValue({ data: {} }),
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
    useHref: vi.fn<(url: To) => string>((url) =>
      typeof url === 'string' ? url : (url as Path).pathname,
    ),
    useParams: vi.fn(() => ({}) as Record<string, string | undefined>),
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
vi.mock('@/data/api/managedWordpress', () => ({
  getManagedCmsResource: vi.fn(() => Promise.resolve(managedWordpressResourceMock)),
  getManagedCmsResourceDetails: vi.fn(() => Promise.resolve(managedWordpressResourceDetailsMock)),
  getManagedCmsResourceWebsites: vi.fn(() => Promise.resolve(managedWordpressWebsitesMock)),
  getManagedCmsResourceWebsiteDetails: vi.fn(() =>
    Promise.resolve(managedWordpressWebsitesDetailsMock),
  ),
  deleteManagedCmsResourceWebsite: vi.fn(() => Promise.resolve(managedWordpressWebsitesDeleteMock)),
  getManagedCmsResourceWebsiteTasks: vi.fn(() => Promise.resolve(managedWordpressWebsitesTaskMock)),
  getManagedCmsReferenceAvailableLanguages: vi.fn(() =>
    Promise.resolve(managedWordpressRerefenceAvailableLanguageMock),
  ),
}));
afterEach(() => {
  vi.clearAllMocks();
});
