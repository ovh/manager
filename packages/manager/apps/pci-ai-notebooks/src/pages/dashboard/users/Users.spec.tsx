import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Users, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/users/Users.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedPublicCloudUser } from '@/__tests__/helpers/mocks/user';
import { Locale } from '@/hooks/useLocale';

const mockedUsedNavigate = vi.fn();
describe('Users page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/user/user.api', () => ({
      getUsers: vi.fn(() => [mockedPublicCloudUser]),
    }));
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });
    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });
  it('renders and shows buttons in the user page', async () => {
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('manage-user-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-user-button')).toBeInTheDocument();
  });

  it('trigger useNavigate on create button click', async () => {
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-user-button')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('create-user-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });
});
