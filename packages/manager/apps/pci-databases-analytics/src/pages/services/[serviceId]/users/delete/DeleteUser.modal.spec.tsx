import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import * as usersApi from '@/data/api/database/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import DeleteUser from '@/pages/services/[serviceId]/users/delete/DeleteUser.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

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

describe('Delete user modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
      userId: mockedDatabaseUser.id,
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
    const { rerender } = render(<DeleteUser />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-user-modal')).not.toBeInTheDocument();
    });
    controller.open = true;
    rerender(<DeleteUser />);
    await waitFor(() => {
      expect(screen.queryByTestId('delete-user-modal')).toBeInTheDocument();
    });
  });
  it('should delete a user on submit', async () => {
    render(<DeleteUser />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.deleteUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userSuccessTitle',
        description: 'deleteUserToastSuccessDescription',
      });
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(usersApi.deleteUser).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteUser />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.deleteUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteUserToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
});
