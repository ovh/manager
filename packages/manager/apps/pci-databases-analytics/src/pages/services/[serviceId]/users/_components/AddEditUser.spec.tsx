import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
  act,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import AddEditUserModal from '@/pages/services/[serviceId]/users/_components/AddEditUser.component';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import {
  mockedDatabaseUser,
  mockedUserRoles,
} from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

describe('AddEdit user form', () => {
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
  it('should render the form', async () => {
    render(<AddEditUserModal service={mockedService} existingUsers={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
  });
  it('should have redis inputs when provided a Redis engine', async () => {
    render(
      <AddEditUserModal
        service={{
          ...mockedService,
          engine: database.EngineEnum.redis,
        }}
        existingUsers={[]}
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
    render(
      <AddEditUserModal
        service={{
          ...mockedService,
          engine: database.EngineEnum.m3db,
        }}
        existingUsers={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.queryByTestId('add-edit-user-modal')).toBeInTheDocument();
      expect(screen.getByText('formUserFieldGroupLabel')).toBeInTheDocument();
    });
  });
  it('should add a user on submit', async () => {
    render(<AddEditUserModal service={mockedService} existingUsers={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
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
    });
  });
  it('should add a user with redis values on submit', async () => {
    render(
      <AddEditUserModal
        service={{
          ...mockedService,
          engine: database.EngineEnum.redis,
        }}
        existingUsers={[]}
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
    });
  });
  it('should add a user with a role', async () => {
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    render(<AddEditUserModal service={mockedService} existingUsers={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('roles-select-input-trigger'),
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
    });
  });
  it('should display an error if user already exists', async () => {
    render(
      <AddEditUserModal
        service={mockedService}
        existingUsers={[
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
      expect(
        screen.getByText('formUserNameErrorDuplicate'),
      ).toBeInTheDocument();
    });
  });
  it('should display an error if userName is too short', async () => {
    render(<AddEditUserModal service={mockedService} existingUsers={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
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
      expect(screen.getByText('formUserErrorMinLength')).toBeInTheDocument();
    });
  });
  it('should display an error if userName is too long', async () => {
    render(<AddEditUserModal service={mockedService} existingUsers={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
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
      expect(screen.getByText('formUserErrorMaxLength')).toBeInTheDocument();
    });
  });
  it('should display an error if userName does not match patter', async () => {
    render(<AddEditUserModal service={mockedService} existingUsers={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
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
      expect(screen.getByText('formUserNameErrorPattern')).toBeInTheDocument();
    });
  });

  it('should add a user with a acl', async () => {
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    const onSuccess = vi.fn();
    render(
      <AddEditUserModal
        service={
          {
            ...mockedService,
            aclsEnabled: true,
            engine: database.EngineEnum.opensearch,
          } as database.Service
        }
        onSuccess={onSuccess}
        existingUsers={[]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByText('formUserAclConfiguredAcls')).toBeInTheDocument();
    });
    act(() => {
      const inputPattern = screen.getByTestId('add-edit-username-input');
      fireEvent.change(inputPattern, {
        target: {
          value: 'newUser',
        },
      });
      fireEvent.change(screen.getByTestId('acl-select-pattern-input'), {
        target: {
          value: 'pattern*',
        },
      });
      fireEvent.click(screen.getByTestId('acl-select-submit-button'));
    });
    await waitFor(() => {
      const list = screen.getByTestId('acl-select-list-acl-item');
      expect(getByText(list, 'pattern*')).toBeInTheDocument();
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
    });
  });

  it('should call onError when api failed', async () => {
    vi.mocked(usersApi.addUser).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<AddEditUserModal service={mockedService} existingUsers={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
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
    });
  });
});
