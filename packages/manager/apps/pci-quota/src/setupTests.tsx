import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useSearchParams: () => [new URLSearchParams({})],
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
      description: 'project-description',
      project_id: 'project-id',
    }),
    getProjectRegions: vi.fn(),
    PciDiscoveryBanner: vi.fn().mockReturnValue(<div>Discovery Banner</div>),
    PciAnnouncementBanner: vi
      .fn()
      .mockReturnValue(<div>Annoucement Banner</div>),
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
    useMe: vi.fn().mockReturnValue({ me: { ovhSubsidiary: 'US' } }),
    PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
    Notifications: vi
      .fn()
      .mockReturnValue(<div data-testid="notifications"></div>),
    useNotifications: () => ({
      addError: vi.fn(),
      addSuccess: vi.fn(),
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

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...mod,
    useTracking: vi.fn(() => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    })),
  };
});

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
