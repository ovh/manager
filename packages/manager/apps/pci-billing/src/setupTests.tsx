import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import React from 'react';
import { vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useSearchParams: () => [new URLSearchParams({ instanceId: 'instance-id' })],
    useParams: () => ({ projectId: 'project-id', kubeId: 'kube-id' }),
    useHref: vi.fn(),
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
    Navigate: () => null,
    Outlet: vi.fn(() => 'Outlet'),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useProject: vi.fn().mockResolvedValue({
      projectName: 'project-name',
      project_id: 'project-id',
    }),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...mod,
    useProjectUrl: vi.fn().mockReturnValue('mockProjectUrl'),
    useDatagridSearchParams: () => ({
      pagination: vi.fn(),
      setPagination: vi.fn(),
      sorting: vi.fn(),
      setSorting: vi.fn(),
    }),
    useTranslatedMicroRegions: vi.fn().mockReturnValue({
      translateMicroRegion: (name: string) => name,
    }),
    PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
    Notifications: vi
      .fn()
      .mockReturnValue(<div data-testid="notifications"></div>),
    useNotifications: () => ({
      addError: vi.fn(),
      addSuccess: vi.fn(),
      clearNotifications: vi.fn(),
    }),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      exists: () => true,
    },
  }),
  Trans: ({ children }: { children: string }) => children,
}));

const mocks = vi.hoisted(() => ({
  environment: {
    getRegion: vi.fn(() => 'EU'),
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR', currency: '€' })),
  },
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked-url'),
    },
    tracking: {
      trackClick: vi.fn(),
    },
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
  ButtonType: {
    link: 'link',
  },
}));

vi.mock('@ovh-ux/manager-core-api', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...mod,
    fetchIcebergV6: vi.fn(),
    v6: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});
