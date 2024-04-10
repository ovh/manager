import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import { database } from '@/models/database';
import { Locale } from '@/hooks/useLocale';
import * as usersApi from '@/api/databases/users';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import DeleteUser from '@/pages/services/[serviceId]/users/_components/deleteUser';
import { CdbError } from '@/api/databases';
import { useToast } from '@/components/ui/use-toast';

const mockService: database.Service = {
  engine: database.EngineEnum.mongodb,
  id: 'serviceId',
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
vi.mock('@/api/databases/users', () => ({
  getUsers: vi.fn(() => [
    {
      id: '0',
      username: 'avadmin',
      status: database.StatusEnum.READY,
      createdAt: '2024-03-19T11:34:47.088723+01:00',
    },
  ]),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(() => []),
  editUser: vi.fn(),
}));

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
vi.mock('@/components/ui/use-toast', () => {
  const toastMock = vi.fn();
  return {
    useToast: vi.fn(() => ({
      toast: toastMock,
    })),
  };
});

describe('Delete user modal', () => {
  beforeEach(async () => {});
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should open the modal', async () => {
    const controller = {
      open: false,
      onOpenChange: vi.fn(),
    };
    const user = {
      id: '0',
      username: 'avadmin',
      status: database.StatusEnum.READY,
      createdAt: '2024-03-19T11:34:47.088723+01:00',
    };
    const { rerender } = render(
      <DeleteUser controller={controller} service={mockService} user={user} />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.queryByTestId('delete-user-modal')).not.toBeInTheDocument();
    });
    controller.open = true;
    rerender(
      <DeleteUser controller={controller} service={mockService} user={user} />,
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
    const user = {
      id: '0',
      username: 'avadmin',
      status: database.StatusEnum.READY,
      createdAt: '2024-03-19T11:34:47.088723+01:00',
    };
    const onSuccess = vi.fn();
    render(
      <DeleteUser
        controller={controller}
        service={mockService}
        user={user}
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
    const user = {
      id: '0',
      username: 'avadmin',
      status: database.StatusEnum.READY,
      createdAt: '2024-03-19T11:34:47.088723+01:00',
    };
    const onError = vi.fn();
    vi.mocked(usersApi.deleteUser).mockImplementation(() => {
      throw new CdbError(
        'test',
        'test error',
        new XMLHttpRequest(),
        { message: 'api error message' },
        500,
        'statusText',
      );
    });
    render(
      <DeleteUser
        controller={controller}
        service={mockService}
        user={user}
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
        description: 'api error message',
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
