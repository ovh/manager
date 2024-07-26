import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { useToast } from '@/components/ui/use-toast';
import ResetUserPassword from '@/pages/services/[serviceId]/users/_components/ResetUserPassword.component';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import {
  mockedDatabaseUser,
  mockedDatabaseUserWithPassword,
} from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

describe('Reset user password modal', () => {
  beforeEach(async () => {
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
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
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
    const controller = {
      open: false,
      onOpenChange: vi.fn(),
    };
    const { rerender } = render(
      <ResetUserPassword
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('reset-password-modal'),
      ).not.toBeInTheDocument();
    });
    controller.open = true;
    rerender(
      <ResetUserPassword
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('reset-password-modal')).toBeInTheDocument();
    });
  });
  it('should reset a user password on submit', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const user = {
      id: '0',
      username: 'avadmin',
      status: database.StatusEnum.READY,
      createdAt: '2024-03-19T11:34:47.088723+01:00',
    };
    const onSuccess = vi.fn();
    render(
      <ResetUserPassword
        controller={controller}
        service={mockedService}
        user={user}
        onSuccess={onSuccess}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.resetUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'resetUserPasswordToastSuccessTitle',
        description: 'resetUserPasswordToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
  it('should call onError when api failed', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onError = vi.fn();
    vi.mocked(usersApi.resetUserPassword).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(
      <ResetUserPassword
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
        onError={onError}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
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
      expect(onError).toHaveBeenCalled();
    });
  });
  it('should copy password to clipboard', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const writeTextMock = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });
    render(
      <ResetUserPassword
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('reset-password-copy-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-copy-button'));
    });
    await waitFor(() => {
      expect(usersApi.resetUserPassword).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'resetUserPasswordToastSuccessTitle',
        description: 'resetUserPasswordToastSuccessDescription',
      });
      expect(writeTextMock).toHaveBeenCalled();
    });
  });
  it('should close modal on close button after submit', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onClose = vi.fn();
    render(
      <ResetUserPassword
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
        onClose={onClose}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
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
      expect(onClose).toHaveBeenCalled();
    });
  });
});
