import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { User } from '@ovh-ux/manager-config';
import * as useMeApi from '@/data/hooks/useMe';
import { urls } from '@/routes/routes.constant';
import UserProvider from '@/context/user/user.provider';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}));

const renderComponent = () =>
  render(
    <UserProvider>
      <></>
    </UserProvider>,
  );

describe('User Provider', () => {
  it('should redirect to the preferences page if there is no active session', async () => {
    vi.spyOn(useMeApi, 'useMe').mockReturnValue({
      isFetched: true,
      error: { status: 401 },
    } as UseQueryResult<User, ApiError>);
    renderComponent();

    await vi.waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(urls.preferences);
    });
  });

  it('should redirect to the preferences page if there is an active session', async () => {
    vi.spyOn(useMeApi, 'useMe').mockReturnValue({
      isFetched: true,
    } as UseQueryResult<User, ApiError>);
    renderComponent();

    await vi.waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(urls.accountType);
    });
  });
});
