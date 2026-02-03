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
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import Users, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/users/Users.page';
import * as database from '@/types/cloud/project/database';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { CdbError } from '@/data/api/database';

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

describe('Users page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
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
    expect(screen.getByTestId('datatable.skeleton')).toBeInTheDocument();
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
      expect(screen.getByText('tableHeadRoles')).toBeInTheDocument();
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
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
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
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
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
  it('renders acl column for opensearch', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        aclsEnabled: true,
        engine: database.EngineEnum.opensearch,
        capabilities: {
          ...mockedService.capabilities,
          userAcls: {
            read: 'enabled',
            update: 'enabled',
          },
        },
      } as database.Service,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    vi.mocked(usersApi.getUsers).mockResolvedValue([
      {
        ...mockedDatabaseUser,
        acls: [
          { pattern: 'pattern1', permission: 'admin' },
          { pattern: 'pattern2', permission: 'read' },
        ],
      },
    ]);
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('toggle-acl')).toBeInTheDocument();
      expect(screen.getByText('tableHeadACLs')).toBeInTheDocument();
    });
    // open the subrow to display acls
    act(() => {
      const expandButton = screen.getAllByTestId('table-row-expand-button')[0];
      fireEvent.click(expandButton);
    });
    await waitFor(() => {
      expect(screen.getByText('tableHeadPattern')).toBeInTheDocument();
      expect(screen.getByText('tableHeadPermission')).toBeInTheDocument();
      expect(screen.getByText('pattern1')).toBeInTheDocument();
      expect(screen.getByText('pattern2')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('read')).toBeInTheDocument();
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
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
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
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
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
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
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
    await openButtonInMenu('users-add-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });
  it('shows edit user modal', async () => {
    await openButtonInMenu('user-action-edit-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./edit/userId');
    });
  });
  it('shows delete user modal', async () => {
    await openButtonInMenu('user-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/userId');
    });
  });
  it('shows reset user password modal', async () => {
    await openButtonInMenu('user-action-reset-password-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './reset-password/userId',
      );
    });
  });
});
