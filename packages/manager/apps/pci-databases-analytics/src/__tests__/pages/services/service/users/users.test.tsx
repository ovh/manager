import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as usersHook from '@/hooks/api/users.api.hooks';
import * as LayoutContext from '@/pages/services/[serviceId]/layout';
import Users, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/users'; // Adjust the import path according to your project structure
import { database } from '@/models/database';
import { Locale } from '@/hooks/useLocale';
import { GenericUser } from '@/api/databases/users';
import { RouterWithLocationWrapper } from '@/__tests__/helpers/wrappers/RouterWithLocationWrapper';

const mockService: database.Service = {
  engine: database.EngineEnum.mongodb,
  id: 'serviceId',
  capabilities: {},
  category: database.CategoryEnum.operational,
  createdAt: '',
  description: '',
  endpoints: [],
  backupTime: '',
  disk: {
    size: 0,
    type: '',
  },
  nodeNumber: 0,
  flavor: '',
  ipRestrictions: [],
  maintenanceTime: '',
  networkType: database.NetworkTypeEnum.private,
  nodes: [],
  plan: '',
  status: database.StatusEnum.READY,
  version: '',
  backups: {
    regions: [],
    time: '',
  },
};
// Mock necessary hooks and dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/hooks/api/users.api.hooks', () => {
  const useGetUsers = vi.fn();
  const useAddUser = vi.fn(() => ({
    addUser: vi.fn(),
    isPending: false,
  }));
  const useEditUser = vi.fn(() => ({
    editUser: vi.fn(),
    isPending: false,
  }));
  const useDeleteUser = vi.fn(() => ({
    deleteUser: vi.fn(),
    isPending: false,
  }));
  const useResetUserPassword = vi.fn(() => ({
    useResetUserPassword: vi.fn(),
    isPending: false,
  }));
  const useGetRoles = vi.fn(() => ({
    data: [],
    isSuccess: true,
  }));
  return {
    useGetUsers,
    useAddUser,
    useEditUser,
    useGetRoles,
    useResetUserPassword,
    useDeleteUser,
  };
});

vi.mock('@/pages/services/[serviceId]/layout', () => {
  const useServiceData = vi.fn(() => ({
    projectId: 'projectId',
    service: mockService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  }));
  return {
    useServiceData,
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  return {
    useShell: vi.fn(() => ({
      i18n: {
        getLocale: vi.fn(() => Locale.fr_FR),
        onLocaleChange: vi.fn(),
        setLocale: vi.fn(),
      },
    })),
  };
});

describe('Users page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />);
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });
  it('renders and shows skeletons while loading', async () => {
    vi.mocked(usersHook.useGetUsers).mockResolvedValue({
      data: [],
      isSuccess: false,
    } as UseQueryResult<GenericUser[], Error>);
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    expect(screen.getByTestId('users-table-skeleton')).toBeInTheDocument();
  });
  it('renders and shows users table', async () => {
    vi.mocked(usersHook.useGetUsers).mockReturnValue({
      isSuccess: true,
      data: [
        {
          id: '0',
          username: 'avadmin',
          status: database.StatusEnum.READY,
          createdAt: '2024-03-19T11:34:47.088723+01:00',
        },
      ],
    } as UseQueryResult<GenericUser[], Error>);
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    await waitFor(() => {
      expect(screen.getByText('avadmin')).toBeInTheDocument();
    });
  });
  it('renders roles column for mongodb', async () => {
    vi.mocked(usersHook.useGetUsers).mockReturnValue({
      isSuccess: true,
      data: [
        {
          id: '0',
          username: 'avadmin',
          status: database.StatusEnum.READY,
          createdAt: '2024-03-19T11:34:47.088723+01:00',
          roles: ['mongoRole'],
        },
      ],
    } as UseQueryResult<GenericUser[], Error>);
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    await waitFor(() => {
      expect(screen.getByText('mongoRole')).toBeInTheDocument();
    });
  });
  it('renders redis columns', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockService,
        engine: database.EngineEnum.redis,
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    vi.mocked(usersHook.useGetUsers).mockReturnValue({
      isSuccess: true,
      data: [
        {
          id: '0',
          username: 'avadmin',
          status: database.StatusEnum.READY,
          createdAt: '2024-03-19T11:34:47.088723+01:00',
          categories: ['categories'],
          channels: ['channels'],
          commands: ['commands'],
          keys: ['keys'],
        },
      ],
    } as UseQueryResult<GenericUser[], Error>);
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    await waitFor(() => {
      expect(screen.getByText('categories')).toBeInTheDocument();
      expect(screen.getByText('channels')).toBeInTheDocument();
      expect(screen.getByText('commands')).toBeInTheDocument();
      expect(screen.getByText('keys')).toBeInTheDocument();
    });
  });
  it('renders group column for m3db', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockService,
        engine: database.EngineEnum.m3db,
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    vi.mocked(usersHook.useGetUsers).mockReturnValue({
      isSuccess: true,
      data: [
        {
          id: '0',
          username: 'avadmin',
          status: database.StatusEnum.READY,
          createdAt: '2024-03-19T11:34:47.088723+01:00',
          group: 'testGroup',
        },
      ],
    } as UseQueryResult<GenericUser[], Error>);
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    await waitFor(() => {
      expect(screen.getByText('testGroup')).toBeInTheDocument();
    });
  });
  it('displays add user button if capability is present', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockService,
        capabilities: {
          users: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    expect(screen.queryByTestId('users-add-button')).toBeInTheDocument();
  });
  it('does not display add user button if capability is absent', async () => {
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    expect(screen.queryByTestId('users-add-button')).toBeNull();
  });
  it('disable add user button if capability is disabled', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockService,
        capabilities: {
          users: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    const addButton = screen.queryByTestId('users-add-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
});
