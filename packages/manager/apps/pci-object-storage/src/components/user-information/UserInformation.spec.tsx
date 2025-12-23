import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import user from '@/types/User';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import UserInformation from './UserInformation.component';

// MOCK AVANT LES IMPORTS DU COMPOSANT !
const downloadMock = vi.fn();
vi.mock('@/hooks/useDownload.hook', () => ({
  default: () => ({ download: downloadMock }),
}));

const mockedCreatingUser: user.User = {
  ...mockedCloudUser,
  status: user.UserStatusEnum.creating,
};

describe('user information component', () => {
  it('renders Loading info while user is not ready component', async () => {
    render(
      <UserInformation
        newUser={mockedCreatingUser}
        access="myAcceess"
        secret="mySecret"
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('user-information-container'),
      ).not.toBeTruthy();
      expect(
        screen.getByTestId('user-information-loading-container'),
      ).toBeTruthy();
    });
  });

  it('renders user Information component', async () => {
    render(
      <UserInformation
        newUser={mockedCloudUser}
        access="myAcceess"
        secret="mySecret"
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('user-information-loading-container'),
      ).not.toBeTruthy();
      expect(screen.getByTestId('user-information-container')).toBeTruthy();
      expect(screen.getByTestId('download-user-button')).toBeTruthy();
    });
  });

  it('should download user info', async () => {
    render(
      <UserInformation
        newUser={mockedCloudUser}
        access="myAcceess"
        secret="mySecret"
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('download-user-button'));
    });

    await waitFor(() => {
      expect(downloadMock).toHaveBeenCalled();
    });
  });
});
