import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'project-id', kubeId: 'kube-id' }),
  useHref: vi.fn(),
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
  Navigate: () => null,
  Outlet: vi.fn(() => 'Outlet'),
}));

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useProject: vi.fn().mockResolvedValue({
      access: 'full',
      creationDate: '2023-08-07T12:00:00Z',
      description: 'This is a mock project for testing purposes.',
      expiration: null,
      iam: {
        displayName: 'Mock Display Name',
        id: 'iam-12345',
        tags: {
          environment: 'test',
          department: 'engineering',
        },
        urn: 'urn:mock:iam:12345',
      },
      manualQuota: true,
      orderId: 987654321,
      planCode: 'PLAN_BASIC',
      projectName: 'Mock Project',
      project_id: 'project-12345',
      status: 'active', // Assuming TProjectStatus includes 'active'
      unleash: false,
    }),
  };
});

vi.mock('@ovhcloud/manager-components', async () => {
  const mod = await vi.importActual('@ovhcloud/manager-components');
  return {
    ...mod,
    useProjectUrl: vi.fn().mockReturnValue('mockProjectUrl'),
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
}));
