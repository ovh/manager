import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'fr_FR',
    },
  }),
}));

vi.mock('@/core/HidePreloader', () => ({
  default: () => <div data-testid="hide-preloader"></div>,
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => `Redirected to ${to}`),
    useParams: vi.fn().mockReturnValue({
      projectId: 'mocked_projectId',
      workflowId: 'workflow1',
    }),
    useNavigate: () => vi.fn(),
    useSearchParams: vi.fn().mockReturnValue([
      new URLSearchParams({
        workflowId: 'workflowId',
      }),
    ]),
    useHref: vi.fn().mockReturnValue(() => ''),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useProject: vi.fn().mockReturnValue({}),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...mod,
    useDatagridSearchParams: () => ({
      pagination: vi.fn(),
      setPagination: vi.fn(),
      sorting: vi.fn(),
      setSorting: vi.fn(),
    }),
    useProjectUrl: () => 'project_url',
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
