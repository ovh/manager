import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Users from '@/pages/dashboard/users/Users.page';
import { Locale } from '@/hooks/useLocale.hook';
import * as usersApi from '@/data/api/user/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';

describe('AddUser modal', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
    vi.mock('@/data/api/user/user.api', () => ({
      getUsers: vi.fn(() => [mockedUser]),
      addUser: vi.fn(() => mockedUser),
    }));
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
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders and shows skeletons while loading', async () => {
    expect(screen.getByTestId('manage-user-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-user-button')).toBeInTheDocument();
  });

  it('open and close add user modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-user-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-user-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-user-modal')).not.toBeInTheDocument();
    });
  });

  it('renders addUser and display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'formUserToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(usersApi.addUser).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    act(() => {
      fireEvent.click(screen.getByTestId('create-user-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('user-description-input'), {
        target: {
          value: 'user-error',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-user-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addUser and display password, copy it and close the modal', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    const successMsg = {
      description: 'formUserToastSuccessDescription',
      title: 'formUserToastSuccessTitle',
    };
    act(() => {
      fireEvent.click(screen.getByTestId('create-user-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('user-description-input'), {
        target: {
          value: 'user-error',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(successMsg);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('user-password-copy-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('user-password-copy-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalled();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('user-close-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-user-modal')).not.toBeInTheDocument();
    });
  });
});
