import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as companySuggestionAPI from '@/data/api/suggestion';
import CompanyPage from './Company.page';
import userContext, { UserContext } from '@/context/user/user.context';
import { CompanySuggestion } from '@/types/suggestion';

const mocks = vi.hoisted(() => ({
  legalForm: 'corporation',
  ovhSubsidiary: 'FR',
  language: 'fr-FR',
  country: 'FR',
  setLegalForm: vi.fn(),
  setCompany: vi.fn(),
  isSMSConsentAvailable: false,
}));

/** Valid company identifier per useCompanySearchSchema (14 digits). */
const VALID_SIRET = '12345678901234';

const { company, company2 } = vi.hoisted(() => {
  const base = {
    country: 'FR' as const,
    creationDate: '23-05-2025',
    primaryCNIN: '123456789',
    secondaryCNIN: '12345678901234',
    vatID: 'FR123',
  };
  return {
    company: { ...base, name: 'test-company' },
    company2: {
      ...base,
      name: 'second-company',
      primaryCNIN: '987654321',
      secondaryCNIN: '98765432109876',
    },
  };
});
const navigate = vi.fn();

const getCompanySuggestionSpy = vi
  .spyOn(companySuggestionAPI, 'getCompanySuggestion')
  .mockResolvedValue({
    entryList: [company, company2],
    hasMore: true,
    provider: 'INSEE',
    type: 'name',
  } as CompanySuggestion);

const setSearchValue = async (input: HTMLElement, value: string) => {
  await act(() => {
    fireEvent.change(input, { target: { value } });
  });
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useSearchParams: () => [
    new URLSearchParams({
      onsuccess: 'https://www.ovh.com/manager',
    }),
    vi.fn(),
  ],
}));

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const module = await importOriginal<
    typeof import('@ovhcloud/ods-components/react')
  >();
  return {
    ...module,
    OdsInput: ({ ...props }) => (
      <input
        name={props.name}
        type="text"
        value={props.value}
        onChange={(event) =>
          props.onOdsChange?.({
            detail: { value: (event.target as HTMLInputElement).value },
          })
        }
        onBlur={props.onBlur}
        data-testid="search-input"
      />
    ),
    OdsButton: ({ ...props }: any) => (
      <module.OdsButton {...props}>{props.label}</module.OdsButton>
    ),
    OdsLink: ({ ...props }) => <a {...props}>{props.label}</a>,
  };
});

vi.mock('@/pages/company/company-tile/CompanyTile.component', () => ({
  default: ({ ...props }) => (
    <div onClick={props.onClick}>{props.company.name}</div>
  ),
}));

const mockedTrackClick = vi.fn();

vi.mock('@/context/tracking/useTracking', () => ({
  useTrackingContext: () => ({
    trackClick: mockedTrackClick,
  }),
}));

const queryClient = new QueryClient();
const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <userContext.Provider value={(mocks as unknown) as UserContext}>
        <CompanyPage />
      </userContext.Provider>
    </QueryClientProvider>,
  );

describe('CompanyPage', () => {
  beforeEach(() => {
    getCompanySuggestionSpy.mockClear();
    mockedTrackClick.mockClear();
    navigate.mockClear();
    mocks.setCompany.mockClear();
    mocks.setLegalForm.mockClear();
    mocks.legalForm = 'corporation';
    queryClient.clear();
  });

  it('should display an error message if the user try to search with an empty value', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await act(() => {
      searchInputElement.focus();
    });
    await waitFor(() => {
      searchInputElement.blur();
      const errorMessageElement = screen.getByText('error_invalid_format');
      expect(errorMessageElement).toBeInTheDocument();
    });
    expect(getCompanySuggestionSpy).not.toHaveBeenCalled();
  });

  it('should display an error message if the user try to search with a value too short', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await setSearchValue(searchInputElement, 'te');
    await act(() => {
      searchInputElement.blur();
    });

    const searchButtonElement = screen.getByText('search');
    await act(() => searchButtonElement.click());
    const errorMessageElement = screen.getByText('error_invalid_format');
    await waitFor(() => {
      expect(errorMessageElement).toBeInTheDocument();
    });
    expect(getCompanySuggestionSpy).not.toHaveBeenCalled();
  });

  it('should not trigger an API call until user clik on the search button', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await setSearchValue(searchInputElement, VALID_SIRET);

    expect(getCompanySuggestionSpy).not.toHaveBeenCalled();
    const searchButtonElement = screen.getByText('search');
    await act(() => searchButtonElement.click());
    expect(mockedTrackClick).toHaveBeenCalledWith(
      { pageName: 'page-name', pageType: 'page' },
      {
        location: 'page',
        buttonType: 'button',
        actions: ['search-enterprise'],
      },
    );
    expect(getCompanySuggestionSpy).toHaveBeenCalled();
  });

  it('should display a fallback link in case user does not have a corporation', async () => {
    renderComponent();

    const fallbackTextElement = screen.getByText(`fallback_${mocks.legalForm}`);
    const fallbackLinkElement = screen.getByText('fallback_link');
    expect(fallbackTextElement).toBeInTheDocument();
    expect(fallbackLinkElement).toBeInTheDocument();
    await act(() => fallbackLinkElement.click());
    expect(mockedTrackClick).toHaveBeenCalledWith(
      { pageName: 'page-name', pageType: 'page' },
      {
        location: 'page',
        buttonType: 'button',
        actions: ['create-individual-account'],
      },
    );
    expect(mocks.setLegalForm).toHaveBeenCalledWith('individual');
  });

  it('should update user context when user select his corporation', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await setSearchValue(searchInputElement, VALID_SIRET);
    const searchButtonElement = screen.getByText('search');
    await act(() => searchButtonElement.click());

    const companyElement = await screen.findByText('test-company');
    await act(() => companyElement.click());
    expect(mockedTrackClick).toHaveBeenCalledWith(
      { pageName: 'page-name', pageType: 'page' },
      {
        location: 'page',
        buttonType: 'button',
        actions: [
          'account-create-add-customer-informations',
          'next',
          `${mocks.ovhSubsidiary}_${mocks.language}_${mocks.legalForm}`,
        ],
      },
    );
    expect(mocks.setCompany).toHaveBeenCalledWith(company);
  });

  it("should display a specific wording depending on user's legal form", async () => {
    mocks.legalForm = 'association';
    renderComponent();

    const fallbackTextElement = screen.getByText(`fallback_${mocks.legalForm}`);
    const fallbackLinkElement = screen.getByText('fallback_button');
    expect(fallbackTextElement).toBeInTheDocument();
    expect(fallbackLinkElement).toBeInTheDocument();

    const searchInputElement = screen.getByTestId('search-input');
    await setSearchValue(searchInputElement, VALID_SIRET);

    const searchButtonElement = screen.getByText('search');
    await act(() => searchButtonElement.click());
    const nonSatisfactoryLinkElement = await screen.findByText(
      `search_not_satisfactory_${mocks.legalForm}`,
    );
    expect(nonSatisfactoryLinkElement).toBeInTheDocument();
  });
});
