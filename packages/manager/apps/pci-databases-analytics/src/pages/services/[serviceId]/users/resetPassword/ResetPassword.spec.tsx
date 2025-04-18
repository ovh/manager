import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ResetUserPassword from '@/pages/services/[serviceId]/users/resetPassword/ResetPassword.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import {
  mockedDatabaseUser,
  mockedDatabaseUserWithPassword,
} from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

describe('Reset user password modal', () => {
  beforeEach(async () => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          category: database.engine.CategoryEnum.all,
          userId: mockedDatabaseUser.id,
        }),
      };
    });
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/user.api', () => ({
      getUsers: vi.fn(() => [mockedDatabaseUser]),
      addUser: vi.fn(),
      deleteUser: vi.fn(),
      resetUserPassword: vi.fn(() => mockedDatabaseUserWithPassword),
      getRoles: vi.fn(() => []),
      editUser: vi.fn(),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
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
    vi.mock('@datatr-ux/uxlib', async () => {
      const mod = await vi.importActual('@datatr-ux/uxlib');
      const toastMock = vi.fn();
      return {
        ...mod,
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should open the modal', async () => {
    const { rerender } = render(<ResetUserPassword />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('reset-password-modal'),
      ).not.toBeInTheDocument();
    });
    rerender(<ResetUserPassword />);
    await waitFor(() => {
      expect(screen.queryByTestId('reset-password-modal')).toBeInTheDocument();
    });
  });
  it('should reset a user password on submit', async () => {
    render(<ResetUserPassword />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.resetUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'resetUserPasswordToastSuccessTitle',
        description: 'resetUserPasswordToastSuccessDescription',
      });
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(usersApi.resetUserPassword).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<ResetUserPassword />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.resetUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'resetUserPasswordToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
  it('should display code with password and uri', async () => {
    render(<ResetUserPassword />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('pwd-connection-info')).toBeInTheDocument();
      expect(screen.getByTestId('code-pwd-container')).toBeInTheDocument();
      expect(screen.getByTestId('code-uri-container')).toBeInTheDocument();
    });
  });
  it('should close modal on close button after submit', async () => {
    render(<ResetUserPassword />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('reset-password-close-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-close-button'));
    });
    await waitFor(() => {
      expect(usersApi.resetUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'resetUserPasswordToastSuccessTitle',
        description: 'resetUserPasswordToastSuccessDescription',
      });
    });
  });
});
