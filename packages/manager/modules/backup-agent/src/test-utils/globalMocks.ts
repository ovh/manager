import { vi } from 'vitest';

const {
  useNavigationGetUrl: useNavigationGetUrlMock,
  useOvhTracking: useOvhTrackingMock,
} = vi.hoisted(() => ({
  useNavigationGetUrl: vi.fn().mockImplementation((urlParams: []) => ({
    data: JSON.stringify(urlParams),
    isLoading: false,
    error: null,
  })),
  useOvhTracking: vi.fn().mockReturnValue({
    trackClick: vi.fn(),
    trackCurrentPage: vi.fn(),
    trackPage: vi.fn(),
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useNavigationGetUrl: useNavigationGetUrlMock,
    useOvhTracking: useOvhTrackingMock,
  };
});
