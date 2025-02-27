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

vi.mock('@ovh-ux/manager-react-components', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...mod,
    useProjectUrl: vi.fn().mockReturnValue('mockProjectUrl'),
    Notifications: vi.fn(),
  };
});

vi.mock('react-i18next', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-i18next')>();

  return {
    ...original,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
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
