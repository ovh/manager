import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import CreateUser from './Create.modal';
import * as userAPI from '@/data/api/user/user.api';
import {
  mockedCloudUser,
  mockedS3Credentials,
  mockedUserDetail,
} from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';

vi.mock('@/data/api/user/user.api', () => ({
  getUser: vi.fn(() => mockedCloudUser),
  addUser: vi.fn(() => mockedUserDetail),
  addS3Credentials: vi.fn(() => mockedS3Credentials),
}));

describe('Create User Modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders CreateUser Modal', async () => {
    render(<CreateUser />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('add-user-modal')).toBeTruthy();
    expect(screen.getByTestId('add-user-input')).toBeTruthy();
    expect(screen.getByTestId('add-user-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(userAPI.addUser).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<CreateUser />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('add-user-submit-button'));
    });

    await waitFor(() => {
      expect(userAPI.addUser).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addUserToastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('trigger onSuccess on submit click and display user information', async () => {
    render(<CreateUser />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.change(screen.getByTestId('add-user-input'), {
        target: { value: 'my new user' },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-user-submit-button'));
    });

    await waitFor(() => {
      expect(userAPI.addUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('add-user-submit-button')).toBeFalsy();
      expect(userAPI.addS3Credentials).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addUserToastSuccessTitle',
        description: 'addUserToastSuccessDescription',
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-user-close-button'));
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });
});
