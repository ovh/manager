import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { vi } from 'vitest';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: vi.fn(() => ({
    getURL: vi.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

vi.mock('react-router-dom', async () => {
  const module = await vi.importActual('react-router-dom');
  return {
    ...module,
    useHref: () => '/',
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/listing' }),
    useParams: () => ({ projectId: '123' }),
  };
});
