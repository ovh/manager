import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import * as MRC from '@ovh-ux/manager-react-components';
import * as useAccountUrnModule from '@/data/hooks/authorizations/useAccountUrn';
import * as usePreferencesModule from '@/data/hooks/preferences/usePreferences';
import * as useTimeModule from '@/data/hooks/time/useTime';
import AgreementsUpdateModal from '@/components/agreements-update-modal/AgreementsUpdateModal.component';
import { Agreements } from '@/types/agreements';

const mocks = vi.hoisted(() => ({
  data: [] as Agreements[],
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const originalModule: typeof import('@tanstack/react-query') = await importOriginal();
  return {
    ...originalModule,
    useQuery: vi.fn(() => ({ data: mocks.data, isFetched: true })),
  };
});

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
       
      getPlugin: (plugin: string) => {
         
        switch (plugin) {
          case 'navigation':
            return {
              getURL: vi.fn(
                (appName, appPath) =>
                  `https://fake-manager.com/manager/${appName}/${appPath}`,
              ),
              navigateTo: vi.fn(),
            };
          case 'environment':
            return {
              getEnvironment: () => ({
                getRegion: vi.fn(),
                getApplicationURL: vi.fn(
                  (app) => `https://fake-manager.com/manager/${app}`,
                ),
                getUser: vi.fn(() => {}),
              }),
            };
          case 'ux':
            return {
              notifyModalActionDone: vi.fn(),
            };
        }
      },
    },
  }),
}));

const renderComponent = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AgreementsUpdateModal />
    </QueryClientProvider>,
  );
};

describe('AgreementsUpdateModal', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/account/#/useraccount/dashboard',
      },
      writable: true,
    });
    vi.spyOn(MRC, 'useFeatureAvailability').mockReturnValue({
      data: {
        'billing:agreementsUpdateModal': true,
      },
      isFetched: true,
    } as MRC.UseFeatureAvailabilityResult<{ 'billing:agreementsUpdateModal': boolean }>);
    vi.spyOn(useAccountUrnModule, 'useAccountUrn').mockReturnValue({
      data: 'fake-urn',
    } as UseQueryResult<string>);
    vi.spyOn(MRC, 'useAuthorizationIam').mockReturnValue({
      isAuthorized: true,
      isFetched: true,
    } as UseQueryResult<MRC.IamCheckResponse> & { isAuthorized: boolean });
    vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
      data: 1,
    } as UseQueryResult<number>);
    vi.spyOn(useTimeModule, 'useTime').mockReturnValue({
      data: 24 * 60 * 60 + 2,
      isFetched: true,
    } as UseQueryResult<number>);
  });

  it('should not render if user is already on agreements page', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/new-billing/#/autorenew/agreements',
      },
      writable: true,
    });

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('agreements-update-modal')).toBeNull();
    });
  });

  it('should not render if the agreements modal feature is not available', async () => {
    vi.spyOn(MRC, 'useFeatureAvailability').mockReturnValue({
      data: {
        'billing:agreementsUpdateModal': false,
      },
      isFetched: true,
    } as MRC.UseFeatureAvailabilityResult<{ 'billing:agreementsUpdateModal': boolean }>);

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('agreements-update-modal')).toBeNull();
    });
  });

  it('should not render if the user is not authorized to validate agreements', async () => {
    vi.spyOn(useAccountUrnModule, 'useAccountUrn').mockReturnValue({
      data: 'fake-urn',
    } as UseQueryResult<string>);
    vi.spyOn(MRC, 'useAuthorizationIam').mockReturnValue({
      isAuthorized: false,
      isFetched: true,
    } as UseQueryResult<MRC.IamCheckResponse> & { isAuthorized: boolean });

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('agreements-update-modal')).toBeNull();
    });
  });

  it('should not render if the modal was displayed less than a day ago', async () => {
    vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
      data: 1,
    } as UseQueryResult<number>);
    vi.spyOn(useTimeModule, 'useTime').mockReturnValue({
      data: 24 * 60 * 60,
      isFetched: true,
    } as UseQueryResult<number>);

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('agreements-update-modal')).toBeNull();
    });
  });

  it('should not render if the user has no pending agreements', async () => {
    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('agreements-update-modal')).toBeNull();
    });
  });

  it('should render if all conditions are met', async () => {
    mocks.data = [{
      id: 1111,
      contractId: 2222,
      agreed: false,
      date: new Date(),
    }];

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('agreements-update-modal')).not.toBeNull();
    });
  });
});
