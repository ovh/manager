import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import DeleteUser from '@/pages/services/[serviceId]/users/_components/DeleteUser.component';
import { useToast } from '@/components/ui/use-toast';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

describe('Delete user modal', () => {
  beforeEach(() => {
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/user.api', () => ({
      getUsers: vi.fn(() => [mockedDatabaseUser]),
      addUser: vi.fn(),
      deleteUser: vi.fn(),
      resetUserPassword: vi.fn(),
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
      <DeleteUser
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.queryByTestId('delete-user-modal')).not.toBeInTheDocument();
    });
    controller.open = true;
    rerender(
      <DeleteUser
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('delete-user-modal')).toBeInTheDocument();
    });
  });
  it('should delete a user on submit', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <DeleteUser
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
        onSuccess={onSuccess}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.deleteUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteUserToastSuccessTitle',
        description: 'deleteUserToastSuccessDescription',
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
    vi.mocked(usersApi.deleteUser).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(
      <DeleteUser
        controller={controller}
        service={mockedService}
        user={mockedDatabaseUser}
        onError={onError}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.deleteUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteUserToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
