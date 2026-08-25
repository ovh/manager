import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import * as usePreferencesModule from '@/data/hooks/preferences/usePreferences';
import * as useTimeModule from '@/data/hooks/time/useTime';
import CompanyInformationModal from '@/components/company-information-modal/CompanyInformationModal.component';

// 14 digits with a Luhn checksum that adds up, and one that does not
const VALID_SIRET = '98471504500014';
const LUHN_INVALID_SIRET = '12345678901234';

const mocks = vi.hoisted(() => ({
  user: {
    legalform: 'corporation',
    country: 'FR',
    certificates: ['fr-e-invoicing-warning'],
    companyNationalIdentificationNumber: '98471504500014',
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
                getApplications: vi.fn(() => ({
                  billing: { container: { path: 'billing' } },
                })),
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
    mocks.user.certificates = ['fr-e-invoicing-warning'];
    mocks.user.companyNationalIdentificationNumber = VALID_SIRET;
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

  it('should not render if the modal was displayed less than an hour ago', async () => {
    vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
      data: 1,
    } as UseQueryResult<number>);
    vi.spyOn(useTimeModule, 'useTime').mockReturnValue({
      data: 60 * 60,
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

  it('should render if the user holds the fr-e-invoicing-account-to-review certificate', async () => {
    mocks.user.certificates = ['fr-e-invoicing-account-to-review'];

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).not.toBeNull();
    });
  });

  it('should not render if the user holds no e-invoicing certificate', async () => {
    mocks.user.certificates = ['some-unrelated-certificate'];

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).toBeNull();
    });
  });

  it('should display the legacy content for the warning/critical certificate', async () => {
    mocks.user.certificates = ['fr-e-invoicing-warning'];

    const { queryByText } = renderComponent();

    await waitFor(() => {
      expect(queryByText('company_information_modal_action_modify')).not.toBeNull();
      expect(queryByText('company_information_modal_review_action_modify')).toBeNull();
    });
  });

  it('should display the review content for the fr-e-invoicing-account-to-review certificate', async () => {
    mocks.user.certificates = ['fr-e-invoicing-account-to-review'];

    const { queryByText } = renderComponent();

    await waitFor(() => {
      expect(queryByText('company_information_modal_review_action_modify')).not.toBeNull();
      expect(queryByText('company_information_modal_action_modify')).toBeNull();
    });
  });

  it.each([
    ['an empty SIRET', ''],
    ['a SIRET shorter than 14 digits', '984715045'],
    ['a non numeric SIRET', '9847150450001A'],
    ['a SIRET failing the Luhn checksum', LUHN_INVALID_SIRET],
  ])('should render for a B2B account holding no certificate but %s', async (_, siret) => {
    mocks.user.certificates = [];
    mocks.user.companyNationalIdentificationNumber = siret;

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).not.toBeNull();
    });
  });

  it.each([
    'individual',
    'personalcorporation',
    'other',
    'association',
    'administration',
  ])(
    'should not render for the %s legal form even with an invalid SIRET',
    async (legalform) => {
      mocks.user.certificates = [];
      mocks.user.legalform = legalform;
      mocks.user.companyNationalIdentificationNumber = '';

      const { queryByTestId } = renderComponent();

      await waitFor(() => {
        expect(queryByTestId('company-information-modal')).toBeNull();
      });
    },
  );

  it.each(['FR', 'GP', 'MQ', 'RE'])(
    'should render for a %s account with an invalid SIRET',
    async (country) => {
      mocks.user.certificates = [];
      mocks.user.country = country;
      mocks.user.companyNationalIdentificationNumber = '';

      const { queryByTestId } = renderComponent();

      await waitFor(() => {
        expect(queryByTestId('company-information-modal')).not.toBeNull();
      });
    },
  );

  it.each(['GF', 'YT', 'BL', 'PM'])(
    'should render for a %s account on its certificate, not on its SIRET',
    async (country) => {
      mocks.user.country = country;
      mocks.user.companyNationalIdentificationNumber = '';
      mocks.user.certificates = ['fr-e-invoicing-critical'];

      const { queryByTestId, queryByText } = renderComponent();

      await waitFor(() => {
        expect(queryByTestId('company-information-modal')).not.toBeNull();
        expect(queryByText('company_information_modal_action_modify')).not.toBeNull();
      });
    },
  );

  it.each(['GF', 'YT', 'BL', 'PM'])(
    'should not render for a %s account whose only problem is its SIRET',
    async (country) => {
      mocks.user.certificates = [];
      mocks.user.country = country;
      mocks.user.companyNationalIdentificationNumber = '';

      const { queryByTestId } = renderComponent();

      await waitFor(() => {
        expect(queryByTestId('company-information-modal')).toBeNull();
      });
    },
  );

  it('should not render for a B2B account holding a valid SIRET and no certificate', async () => {
    mocks.user.certificates = [];
    mocks.user.companyNationalIdentificationNumber = VALID_SIRET;

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).toBeNull();
    });
  });

  it('should display the siret content for an account holding no certificate', async () => {
    mocks.user.certificates = [];
    mocks.user.companyNationalIdentificationNumber = '';

    const { queryByText } = renderComponent();

    await waitFor(() => {
      expect(queryByText('company_information_modal_siret_action_modify')).not.toBeNull();
      expect(queryByText('company_information_modal_action_modify')).toBeNull();
      expect(queryByText('company_information_modal_review_action_modify')).toBeNull();
    });
  });

  it.each([
    ['fr-e-invoicing-warning', 'company_information_modal_action_modify'],
    ['fr-e-invoicing-critical', 'company_information_modal_action_modify'],
    ['fr-e-invoicing-account-to-review', 'company_information_modal_review_action_modify'],
  ])('should let the %s certificate content win over the siret one', async (certificate, expectedKey) => {
    mocks.user.certificates = [certificate];
    mocks.user.companyNationalIdentificationNumber = '';

    const { queryByText } = renderComponent();

    await waitFor(() => {
      expect(queryByText(expectedKey)).not.toBeNull();
      expect(queryByText('company_information_modal_siret_action_modify')).toBeNull();
    });
  });

  it.each([
    ['the invoices page', '/manager/billing/', '#/history'],
    ['any other billing page', '/manager/billing', '#/autorenew'],
  ])('should leave %s to the billing modal', async (_, pathname, hash) => {
    mocks.user.certificates = [];
    mocks.user.companyNationalIdentificationNumber = '';
    Object.defineProperty(window, 'location', {
      value: {
        href: `https://fake-manager.com${pathname}${hash}`,
        pathname,
      },
      writable: true,
    });

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).toBeNull();
    });
  });

  it('should still render outside the billing application', async () => {
    mocks.user.certificates = [];
    mocks.user.companyNationalIdentificationNumber = '';
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/hub/#/',
        pathname: '/manager/hub/',
      },
      writable: true,
    });

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).not.toBeNull();
    });
  });

  it('should not mistake an application whose path merely contains billing', async () => {
    mocks.user.certificates = [];
    mocks.user.companyNationalIdentificationNumber = '';
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://fake-manager.com/manager/pci-billing/#/',
        pathname: '/manager/pci-billing/',
      },
      writable: true,
    });

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('company-information-modal')).not.toBeNull();
    });
  });
});
