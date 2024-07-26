import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ServiceContext from '@/pages/services/[serviceId]/Service.context';
import Users, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/users/Users.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    userCredentialsReset: {
      create: database.service.capability.StateEnum.enabled,
    },
    users: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

describe('Users page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
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
  it('renders and shows skeletons while loading', async () => {
    vi.mocked(usersApi.getUsers).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('users-table-skeleton')).toBeInTheDocument();
  });
  it('renders and shows users table', async () => {
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedDatabaseUser.username)).toBeInTheDocument();
    });
  });
  it('renders roles column for mongodb', async () => {
    vi.mocked(usersApi.getUsers).mockResolvedValue([
      {
        ...mockedDatabaseUser,
        roles: ['mongoRole'],
      },
    ]);
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('mongoRole')).toBeInTheDocument();
    });
  });
  it('renders redis columns', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        engine: database.EngineEnum.redis,
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    vi.mocked(usersApi.getUsers).mockResolvedValue([
      {
        ...mockedDatabaseUser,
        categories: ['categories'],
        channels: ['channels'],
        commands: ['commands'],
        keys: ['keys'],
      },
    ]);
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('categories')).toBeInTheDocument();
      expect(screen.getByText('channels')).toBeInTheDocument();
      expect(screen.getByText('commands')).toBeInTheDocument();
      expect(screen.getByText('keys')).toBeInTheDocument();
    });
  });
  it('renders group column for m3db', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        engine: database.EngineEnum.m3db,
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    vi.mocked(usersApi.getUsers).mockResolvedValue([
      {
        ...mockedDatabaseUser,
        group: 'testGroup',
      },
    ]);
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('testGroup')).toBeInTheDocument();
    });
  });
  it('displays add user button if capability is present', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          users: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('users-add-button')).toBeInTheDocument();
  });
  it('does not display add user button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {},
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('users-add-button')).toBeNull();
  });
  it('disable add user button if capability is disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          users: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    const addButton = screen.queryByTestId('users-add-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
});

describe('Open modals', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('user-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    const actionButton = screen.getByTestId(buttonId);
    await waitFor(() => {
      expect(actionButton).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(actionButton);
    });
  };
  beforeEach(async () => {
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedDatabaseUser.username)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows add user modal', async () => {
    await openButtonInMenu('user-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-user-modal')).toBeInTheDocument();
    });
  });
  it('closes add user modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('users-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-user-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-user-modal'),
      ).not.toBeInTheDocument();
    });
  });
  it('refetch data on add user success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('users-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-user-modal')).toBeInTheDocument();
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
      expect(
        screen.queryByTestId('add-edit-user-modal'),
      ).not.toBeInTheDocument();
      expect(usersApi.getUsers).toHaveBeenCalled();
    });
  });

  it('shows delete user modal', async () => {
    await openButtonInMenu('user-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-user-modal')).toBeInTheDocument();
    });
  });
  it('closes delete user modal', async () => {
    await openButtonInMenu('user-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-user-modal')).not.toBeInTheDocument();
    });
  });
  it('refetch data on delete user success', async () => {
    const mockedServiceData = vi
      .mocked(ServiceContext.useServiceData)
      .getMockImplementation();
    mockedServiceData().serviceQuery.refetch = vi.fn();
    await openButtonInMenu('user-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-submit-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-user-modal')).not.toBeInTheDocument();
      expect(mockedServiceData().serviceQuery.refetch).toHaveBeenCalled();
    });
  });

  it('shows edit user modal', async () => {
    await openButtonInMenu('user-action-edit-button');
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
  });
  it('closes edit user modal', async () => {
    await openButtonInMenu('user-action-edit-button');
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-user-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-user-modal'),
      ).not.toBeInTheDocument();
    });
  });
  it('refetch data on edit user success', async () => {
    const mockedServiceData = vi
      .mocked(ServiceContext.useServiceData)
      .getMockImplementation();
    mockedServiceData().serviceQuery.refetch = vi.fn();
    await openButtonInMenu('user-action-edit-button');
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-user-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-user-modal'),
      ).not.toBeInTheDocument();
      expect(mockedServiceData().serviceQuery.refetch).toHaveBeenCalled();
    });
  });

  it('shows reset password user modal', async () => {
    await openButtonInMenu('user-action-reset-password-button');
    await waitFor(() => {
      expect(screen.getByTestId('reset-password-modal')).toBeInTheDocument();
    });
  });
  it('closes reset password user modal', async () => {
    const mockedServiceData = vi
      .mocked(ServiceContext.useServiceData)
      .getMockImplementation();
    mockedServiceData().serviceQuery.refetch = vi.fn();
    await openButtonInMenu('user-action-reset-password-button');
    await waitFor(() => {
      expect(screen.getByTestId('reset-password-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('reset-password-modal'),
      ).not.toBeInTheDocument();
      expect(mockedServiceData().serviceQuery.refetch).toHaveBeenCalled();
    });
  });
});
