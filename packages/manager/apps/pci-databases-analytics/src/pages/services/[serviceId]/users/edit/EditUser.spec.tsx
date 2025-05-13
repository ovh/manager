import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EditUser from './EditUser.modal'; // Adjust the path as needed
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';
import * as usersApi from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@datatr-ux/uxlib', () => ({
  Skeleton: vi.fn(() => <div data-testid="skeleton" />),
}));
vi.mock('../_components/AddEditUser.component', () => ({
  default: vi.fn(() => <div data-testid="add-edit-user-modal" />),
}));
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
      userId: mockedDatabaseUser.id,
    }),
  };
});
vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(() => [mockedDatabaseUser]),
  addUser: vi.fn((user) => user),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(() => []),
  editUser: vi.fn((user) => user),
}));

describe('EditUser modal', () => {
  beforeEach(() => {
    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal when data is fetched successfully', async () => {
    // Simulate successful data fetching in the useGetUsers hook
    vi.mocked(usersApi.getUsers).mockResolvedValue([mockedDatabaseUser]);
    render(<EditUser />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-edit-user-modal')).toBeInTheDocument();
    });
  });
});
