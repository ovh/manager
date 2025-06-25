import { describe, expect, it, vi } from 'vitest';
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
  country: 'FR',
  setLegalForm: vi.fn(),
  setCompany: vi.fn(),
}));
const company = vi.hoisted(() => ({
  country: 'FR',
  creationDate: '23-05-2025',
  name: 'test-company',
  primaryCNIN: '123456789',
}));
const navigate = vi.fn();

const getCompanySuggestionSpy = vi
  .spyOn(companySuggestionAPI, 'getCompanySuggestion')
  .mockResolvedValue({
    entryList: [company],
    hasMore: true,
    provider: 'INSEE',
    type: 'name',
  } as CompanySuggestion);

const setSearchValue = async (input: HTMLElement, value: string) => {
  await act(() =>
    waitFor(() => {
      fireEvent.change(input, { target: { value } });
    }),
  );
};

vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigate);

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
        onChange={props.onOdsChange}
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
  });

  it('should display an error message if the user try to search with an empty value', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await act(() => {
      searchInputElement.focus();
    });
    await waitFor(() => {
      searchInputElement.blur();
      const errorMessageElement = screen.getByText('required_field');
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
    const errorMessageElement = screen.getByText('error_min_chars');
    await waitFor(() => {
      expect(errorMessageElement).toBeInTheDocument();
    });
    expect(getCompanySuggestionSpy).not.toHaveBeenCalled();
  });

  it('should not trigger an API call until user clik on the search button', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await setSearchValue(searchInputElement, 'test');

    expect(getCompanySuggestionSpy).not.toHaveBeenCalled();
    const searchButtonElement = screen.getByText('search');
    await act(() => searchButtonElement.click());
    expect(getCompanySuggestionSpy).toHaveBeenCalled();
  });

  it('should display a fallback link in case user does not have a corporation', async () => {
    renderComponent();

    const fallbackTextElement = screen.getByText('fallback');
    const fallbackLinkElement = screen.getByText('fallback_link');
    expect(fallbackTextElement).toBeInTheDocument();
    expect(fallbackLinkElement).toBeInTheDocument();
    await act(() => fallbackLinkElement.click());
    expect(mocks.setLegalForm).toHaveBeenCalledWith('individual');
  });

  it('should display a fallback link if user does not find his corporation', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await setSearchValue(searchInputElement, 'test');

    expect(getCompanySuggestionSpy).not.toHaveBeenCalled();
    const searchButtonElement = screen.getByText('search');
    await act(() => searchButtonElement.click());
    const fallbackLinkElement = screen.getByText('search_not_satisfactory');
    expect(fallbackLinkElement).toBeInTheDocument();
  });

  it('should update user context when user select his corporation', async () => {
    renderComponent();

    const searchInputElement = screen.getByTestId('search-input');
    await setSearchValue(searchInputElement, 'test');
    const searchButtonElement = screen.getByText('search');
    await act(() => searchButtonElement.click());

    const companyElement = screen.getByText('test-company');
    expect(companyElement).toBeInTheDocument();
    await act(() => companyElement.click());
    expect(mocks.setCompany).toHaveBeenCalledWith(company);
  });
});
