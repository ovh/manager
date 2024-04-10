import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { act } from 'react-dom/test-utils';
import * as usersHook from '@/hooks/api/users.api.hooks';
import * as LayoutContext from '@/pages/services/[serviceId]/layout';
import Users from '@/pages/services/[serviceId]/users';
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
  const resetPasswordMock = vi.fn();
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
    useResetUserPassword: resetPasswordMock,
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

describe('Reset user password', () => {
  beforeEach(async () => {
    // mock data
    const serviceQuery = {
      isSuccess: true,
      data: mockService,
    } as UseQueryResult<database.Service, Error>;
    serviceQuery.refetch = vi.fn();
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockService,
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
      },
      category: 'operational',
      serviceQuery,
    });
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
    // render page
    render(<Users />, { wrapper: RouterWithLocationWrapper });
    // open menu
    act(() => {
      fireEvent.pointerDown(
        screen.getByTestId('user-action-trigger'),
        new PointerEvent('pointerdown', {
          ctrlKey: false,
          button: 0,
        }),
      );
    });
    const resetPasswordButton = screen.getByTestId(
      'user-action-reset-password-button',
    );
    await waitFor(() => {
      expect(resetPasswordButton).toBeInTheDocument();
    });
    // click on reset pass button
    act(() => {
      fireEvent.click(resetPasswordButton);
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('shows reset password', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('reset-password-modal')).toBeInTheDocument();
    });
  });
  it('close modal and refetch data onClose', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('reset-password-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('reset-password-cancel-button'));
    });
    await waitFor(() => {
      expect(
        LayoutContext.useServiceData().serviceQuery.refetch,
      ).toHaveBeenCalled();
      expect(
        screen.queryByTestId('reset-password-modal'),
      ).not.toBeInTheDocument();
    });
  });
  it('reset the password on submit', async () => {});
  it('copy the new password in the clipboard on click', async () => {});
  it('displays a toast error on error', async () => {});
});
