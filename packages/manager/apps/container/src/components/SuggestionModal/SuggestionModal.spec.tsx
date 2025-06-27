import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import * as MRC from '@ovh-ux/manager-react-components';
import * as usePreferencesModule from '@/hooks/preferences/usePreferences';
import * as useTimeModule from '@/hooks/time/useTime';
import SuggestionModal from '@/components/SuggestionModal/SuggestionModal.component';
import { Suggestion } from '@/types/suggestion';

const mocks = vi.hoisted(() => ({
  href: 'https://fake-manager.com/manager/dedicated/#/account',
  user: {
    legalform: 'corporation',
    country: 'FR',
    companyNationalIdentificationNumber: 'suggestedNIN',
    vat: 'suggestedVAT',
  },
  data: [] as Suggestion[],
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
      // eslint-disable-next-line consistent-return
      getPlugin: (plugin: string) => {
        // eslint-disable-next-line default-case
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
                getApplicationURL: vi.fn(
                  (app) => `https://fake-manager.com/manager/${app}`,
                ),
                getUser: vi.fn(() => mocks.user),
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
      <SuggestionModal />
    </QueryClientProvider>,
  );
};

describe('SuggestionModal', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/new-billing/#/autorenew/agreements',
      },
      writable: true,
    });
    vi.spyOn(MRC, 'useFeatureAvailability').mockReturnValue({
      data: {
        'hub:popup-hub-invite-customer-siret': true,
      },
      isFetched: true,
    } as MRC.UseFeatureAvailabilityResult<{ 'hub:popup-hub-invite-customer-siret': boolean }>);
    vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
      data: 1,
    } as UseQueryResult<number>);
    vi.spyOn(useTimeModule, 'useTime').mockReturnValue({
      data: 24 * 60 * 60 + 2,
      isFetched: true,
    } as UseQueryResult<number>);
  });

  it('should not render if user is not concerned by suggestion', async () => {
    mocks.user.legalform = 'individual';

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('suggestion-modal')).toBeNull();
    });
  });

  it('should not render if user is already on user info page', async () => {
    mocks.user.legalform = 'corporation';
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/new-account/#/useraccount/infos',
      },
      writable: true,
    });

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('suggestion-modal')).toBeNull();
    });
  });

  it('should not render if the suggestion modal feature is not available', async () => {
    vi.spyOn(MRC, 'useFeatureAvailability').mockReturnValue({
      data: {
        'hub:popup-hub-invite-customer-siret': false,
      },
      isFetched: true,
    } as MRC.UseFeatureAvailabilityResult<{ 'hub:popup-hub-invite-customer-siret': boolean }>);

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('suggestion-modal')).toBeNull();
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
      expect(queryByTestId('suggestion-modal')).toBeNull();
    });
  });

  it('should not render if the user has no suggestions', async () => {
    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('suggestion-modal')).toBeNull();
    });
  });

  it('should not render if suggestions do not differ from user data', async () => {
    mocks.data = [
      {
        type: 'SIRET',
        id: 'suggestedNIN',
      },
      {
        type: 'VAT',
        id: 'suggestedVAT',
      },
    ];

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('suggestion-modal')).toBeNull();
    });
  });

  it('should render if suggestions differ from user data', async () => {
    mocks.data = [
      {
        type: 'SIRET',
        id: 'differentNIN',
      },
      {
        type: 'VAT',
        id: 'differentVAT',
      },
    ];

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('suggestion-modal')).not.toBeNull();
    });
  });
});
