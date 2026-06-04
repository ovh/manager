import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import * as usePreferencesModule from '@/data/hooks/preferences/usePreferences';
import * as useTimeModule from '@/data/hooks/time/useTime';
import CompanyInformationModal from '@/components/company-information-modal/CompanyInformationModal.component';

const mocks = vi.hoisted(() => ({
  user: {
    legalform: 'corporation',
    country: 'FR',
  },
  businessVerificationRequired: true,
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const originalModule: typeof import('@tanstack/react-query') = await importOriginal();
  return {
    ...originalModule,
    useQuery: vi.fn(() => ({
      data: mocks.businessVerificationRequired,
      isFetched: true,
    })),
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
          case 'tracking':
            return {
              trackClick: vi.fn(),
              trackPage: vi.fn(),
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
      <CompanyInformationModal />
    </QueryClientProvider>,
  );
};

describe('CompanyInformationModal', () => {
  beforeEach(() => {
    mocks.user.legalform = 'corporation';
    mocks.user.country = 'FR';
    mocks.businessVerificationRequired = true;
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/new-billing/#/autorenew/agreements',
      },
      writable: true,
    });
    vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
      data: 1,
    } as UseQueryResult<number>);
    vi.spyOn(useTimeModule, 'useTime').mockReturnValue({
      data: 24 * 60 * 60 + 2,
      isFetched: true,
    } as UseQueryResult<number>);
  });

  it('should not render if user is not concerned by business verification', async () => {
    mocks.user.legalform = 'individual';

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).toBeNull();
    });
  });

  it('should not render if user is not in France', async () => {
    mocks.user.country = 'DE';

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).toBeNull();
    });
  });

  it('should not render if user is already on user info page', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/account/#/useraccount/infos',
      },
      writable: true,
    });

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).toBeNull();
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
      expect(queryByTestId('company-information-modal')).toBeNull();
    });
  });

  it('should render if business verification is required', async () => {
    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).not.toBeNull();
    });
  });
});
