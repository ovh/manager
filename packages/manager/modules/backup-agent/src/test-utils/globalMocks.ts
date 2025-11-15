import { vi } from 'vitest';

const { useNavigationGetUrl: useNavigationGetUrlMock } = vi.hoisted(() => ({
  useNavigationGetUrl: vi.fn().mockImplementation((urlParams: []) => ({
    data: JSON.stringify(urlParams),
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useNavigationGetUrl: useNavigationGetUrlMock,
  };
});
