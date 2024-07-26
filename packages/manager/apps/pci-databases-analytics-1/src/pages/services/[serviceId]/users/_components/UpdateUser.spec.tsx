import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { useToast } from '@/components/ui/use-toast';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import AddEditUserModal from '@/pages/services/[serviceId]/users/_components/AddEditUser.component';

describe('Edit user modal', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
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
      editUser: vi.fn((user) => user),
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
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        editedUser={mockedDatabaseUser}
        isEdition={true}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-user-modal'),
      ).not.toBeInTheDocument();
    });
    controller.open = true;
    rerender(
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        editedUser={mockedDatabaseUser}
        isEdition={true}
        users={[]}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
  });
  it('should edit a user on submit', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={{
          ...mockedService,
          engine: database.EngineEnum.m3db,
        }}
        editedUser={{
          ...mockedDatabaseUser,
          group: 'myGroup',
        }}
        isEdition={true}
        onSuccess={onSuccess}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-group-input'), {
        target: {
          value: 'newGroup',
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.editUser).toHaveBeenCalledWith({
        engine: database.EngineEnum.m3db,
        projectId: 'projectId',
        serviceId: mockedService.id,
        user: {
          id: mockedDatabaseUser.id,
          group: 'newGroup',
        },
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formUserToastSuccessTitle',
        description: 'editUserToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(usersApi.editUser).mockImplementation(() => {
      throw apiErrorMock;
    });
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onError = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={{
          ...mockedService,
          engine: database.EngineEnum.m3db,
        }}
        editedUser={{
          ...mockedDatabaseUser,
          group: 'myGroup',
        }}
        isEdition={true}
        onError={onError}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-group-input'), {
        target: {
          value: 'newGroup',
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.editUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'editUserToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
