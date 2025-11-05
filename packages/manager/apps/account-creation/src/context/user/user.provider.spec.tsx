import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Application, User } from '@ovh-ux/manager-config';
import * as MRC from '@ovh-ux/manager-react-components';
import * as useMeApi from '@/data/hooks/useMe';
import * as useApplicationsApi from '@/data/hooks/useApplications';
import { urls } from '@/routes/routes.constant';
import UserProvider from '@/context/user/user.provider';

const url = 'https://fake-manager.com/signup';
vi.spyOn(useApplicationsApi, 'useApplications').mockReturnValue({
  isFetched: true,
  data: {
    'sign-up': {
      container: {
        enabled: false,
        isDefault: false,
        path: 'sign-up',
        containerURL: 'https://fake-manager.com',
      },
      universe: 'hub',
      url,
    },
  } as Record<string, Application>,
} as UseQueryResult<Record<string, Application>>);

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
}));

vi.mock('@/context/tracking/useTracking', () => ({
  useTrackingContext: () => ({
    setUser: vi.fn(),
  }),
}));

const queryClient = new QueryClient();
const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <></>
      </UserProvider>
    </QueryClientProvider>,
  );

describe('User Provider', () => {
  it('should redirect to the settings page if there is no active session', async () => {
    vi.spyOn(useMeApi, 'useMe').mockReturnValue({
      isFetched: true,
      error: { status: 401 },
    } as UseQueryResult<User, ApiError>);
    renderComponent();

    await vi.waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(urls.settings);
    });
  });

  it('should redirect to the account type page if logged in user is authorized', async () => {
    vi.spyOn(MRC, 'useFeatureAvailability').mockReturnValue({
      isFetched: true,
      data: {
        'account-creation': true,
      },
    } as MRC.UseFeatureAvailabilityResult<{ 'account-creation': boolean }>);
    renderComponent();

    await vi.waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(urls.accountType);
    });
  });

  it('should redirect to the legacy signup page if logged in user is not authorized', async () => {
    const mockedLocationAssign = vi.fn();
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: '/account-creation',
        assign: mockedLocationAssign,
      },
      writable: true,
    });
    vi.spyOn(MRC, 'useFeatureAvailability').mockReturnValue({
      isFetched: true,
      data: {
        'account-creation': false,
      },
    } as MRC.UseFeatureAvailabilityResult<{ 'account-creation': boolean }>);
    renderComponent();

    await vi.waitFor(() => {
      expect(mockedLocationAssign).toHaveBeenCalledWith(url);
    });
  });
});
