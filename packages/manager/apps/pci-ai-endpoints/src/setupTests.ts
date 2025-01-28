import '@testing-library/jest-dom';
import { vi } from 'vitest';

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
    Notifications: vi.fn(),
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
