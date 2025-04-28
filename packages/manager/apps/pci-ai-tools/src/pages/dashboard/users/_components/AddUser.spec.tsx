import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import * as usersApi from '@/data/api/user/user.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUserDetails } from '@/__tests__/helpers/mocks/user';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import AddUser from './AddUser.modal';

describe('AddUser modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/user/user.api', () => ({
      addUser: vi.fn(() => mockedUserDetails),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add user modal', async () => {
    render(<AddUser />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-user-modal')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-user-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-user-modal')).toBeNull();
    });
  });

  it('renders addUser and display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'formUserToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(usersApi.addUser).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<AddUser />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('user-description-input'), {
        target: {
          value: 'user-error',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addUser and display password, copy it and close the modal', async () => {
    const successMsg = {
      description: 'formUserToastSuccessDescription',
      title: 'formUserToastSuccessTitle',
    };
    render(<AddUser />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('user-description-input'), {
        target: {
          value: 'newUser',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-user-submit-button'));
    });
    await waitFor(() => {
      expect(usersApi.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(successMsg);
    });

    await waitFor(() => {
      expect(screen.getByTestId('code-container')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('user-close-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-user-modal')).toBeNull();
    });
  });
});
