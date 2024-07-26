import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { useToast } from '@/components/ui/use-toast';
import AddEditUserModal from '@/pages/services/[serviceId]/users/_components/AddEditUser.component';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import {
  mockedDatabaseUser,
  mockedUserRoles,
} from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

describe('Add user modal', () => {
  beforeEach(async () => {
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/user.api', () => ({
      getUsers: vi.fn(() => [mockedDatabaseUser]),
      addUser: vi.fn((user) => user),
      deleteUser: vi.fn(),
      resetUserPassword: vi.fn(),
      getRoles: vi.fn(() => mockedUserRoles),
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
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        isEdition={false}
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
        isEdition={false}
        users={[]}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
  });
  it('should have redis inputs when provided a Redis engine', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    render(
      <AddEditUserModal
        controller={controller}
        service={{
          ...mockedService,
          engine: database.EngineEnum.redis,
        }}
        isEdition={false}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.queryByTestId('add-edit-user-modal')).toBeInTheDocument();
      expect(screen.getByText('formUserFieldKeysLabel')).toBeInTheDocument();
      expect(
        screen.getByText('formUserFieldCategoriesLabel'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('formUserFieldCommandsLabel'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('formUserFieldChannelsLabel'),
      ).toBeInTheDocument();
    });
  });
  it('should have group input when provided a m3db engine', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    render(
      <AddEditUserModal
        controller={controller}
        service={{
          ...mockedService,
          engine: database.EngineEnum.m3db,
        }}
        isEdition={false}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.queryByTestId('add-edit-user-modal')).toBeInTheDocument();
      expect(screen.getByText('formUserFieldGroupLabel')).toBeInTheDocument();
    });
  });
  it('should add a user on submit', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        isEdition={false}
        onSuccess={onSuccess}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: 'newUser',
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formUserToastSuccessTitle',
        description: 'addUserToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
  it('should add a user with redis values on submit', async () => {
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
          engine: database.EngineEnum.redis,
        }}
        isEdition={false}
        onSuccess={onSuccess}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: 'newUser',
        },
      });
      const tagsInput = screen.getAllByTestId('input_tag');
      const tagsInputButtons = screen.getAllByTestId('add_tag_button');
      fireEvent.change(tagsInput[0], {
        target: {
          value: 'newKey',
        },
      });
      fireEvent.click(tagsInputButtons[0]);
    });
    await waitFor(() => {
      expect(screen.getByText('newKey')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formUserToastSuccessTitle',
        description: 'addUserToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalledWith({
        engine: 'redis',
        projectId: 'projectId',
        serviceId: 'serviceId',
        user: {
          categories: [],
          channels: [],
          commands: [],
          keys: ['newKey'],
          name: 'newUser',
        },
      });
    });
  });
  it('should add a user with a role', async () => {
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        isEdition={false}
        onSuccess={onSuccess}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(
        screen.getByText('formUserRoleInputPlaceholder'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: 'newUser',
        },
      });
      const trigger = screen.getByTestId('roles-select-input-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, { key: 'Enter', code: 13 });
    });
    await waitFor(() => {
      expect(
        screen.getByText('formUserRoleInputAdminRoles'),
      ).toBeInTheDocument();
    });
    act(() => {
      const options = screen.getAllByRole('option');
      fireEvent.keyDown(options[0], { key: 'Enter', code: 13 });
      fireEvent.click(screen.getByTestId('roles-select-submit-button'));
    });
    await waitFor(() => {
      const list = screen.getByTestId('roles-select-list-roles');
      expect(getByText(list, mockedUserRoles[0])).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formUserToastSuccessTitle',
        description: 'addUserToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalledWith({
        engine: 'mongodb',
        projectId: 'projectId',
        serviceId: 'serviceId',
        user: {
          name: 'newUser',
          roles: ['backup@admin'],
        },
      });
    });
  });
  it('should display an error if user already exists', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        isEdition={false}
        onSuccess={onSuccess}
        users={[
          mockedDatabaseUser,
          {
            ...mockedDatabaseUser,
            username: `${mockedDatabaseUser.username}1@admin`,
          },
        ]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: mockedDatabaseUser.username,
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(
        screen.getByText('formUserNameErrorDuplicate'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: `${mockedDatabaseUser.username}1`,
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(
        screen.getByText('formUserNameErrorDuplicate'),
      ).toBeInTheDocument();
    });
  });
  it('should display an error if userName is too short', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        isEdition={false}
        onSuccess={onSuccess}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: 'a',
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(screen.getByText('formUserErrorMinLength')).toBeInTheDocument();
    });
  });
  it('should display an error if userName is too long', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        isEdition={false}
        onSuccess={onSuccess}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: 'aNewUserNameWithAVeryLongValueThatExceedsTheMaxLengthValue',
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(screen.getByText('formUserErrorMaxLength')).toBeInTheDocument();
    });
  });
  it('should display an error if userName does not match patter', async () => {
    const controller = {
      open: true,
      onOpenChange: vi.fn(),
    };
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        controller={controller}
        service={mockedService}
        isEdition={false}
        onSuccess={onSuccess}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: '[*/-+]',
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(screen.getByText('formUserNameErrorPattern')).toBeInTheDocument();
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(usersApi.addUser).mockImplementation(() => {
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
        service={mockedService}
        isEdition={false}
        onError={onError}
        users={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-username-input'), {
        target: {
          value: 'newUser',
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addUserToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
