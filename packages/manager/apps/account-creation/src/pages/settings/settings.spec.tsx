import { describe, expect, it, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as API from '@ovh-ux/manager-core-api';
import SettingsPage from './settings.page';
import {
  MockedASSettings,
  MockedBJSettings,
  MockedFRSettings,
  MockedGBSettings,
} from '@/data/mocks/settings.mock';

const mockedApiResult = [
  MockedGBSettings,
  MockedFRSettings,
  MockedASSettings,
  MockedBJSettings,
];

vi.mock('@ovh-ux/manager-core-api');
vi.mocked(API.v6.get).mockImplementation(() =>
  Promise.resolve({ data: mockedApiResult }),
);
vi.mock('react-router-dom', () => ({
  useSearchParams: () => [
    new URLSearchParams({
      login: 'https://www.ovh.com/auth/login',
      signup: 'https://www.ovh.com/auth/signup',
    }),
    vi.fn(),
  ],
}));

const setInputhValue = async (input: HTMLElement, value: string) => {
  await act(() =>
    waitFor(() => {
      fireEvent.change(input, { target: { value } });
    }),
  );
};

const queryClient = new QueryClient();
const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <SettingsPage />
    </QueryClientProvider>,
  );

describe('SettingsPage', () => {
  it('should display by default inputs with the ones for currency and language disabled', async () => {
    renderComponent();

    const countryComboboxElement = screen.getByTestId('country-combobox');
    const currencySelectElement = screen.getByTestId('currency-select');
    const languageSelectElement = screen.getByTestId('language-select');

    expect(countryComboboxElement).toBeInTheDocument();
    expect(currencySelectElement).toBeInTheDocument();
    expect(languageSelectElement).toBeInTheDocument();

    expect(currencySelectElement.getAttribute('is-disabled')).toBe('true');
    expect(languageSelectElement.getAttribute('is-disabled')).toBe('true');
  });

  it('should enable currency input when a country is selected', async () => {
    renderComponent();

    const countryComboboxElement = screen.getByTestId('country-combobox');

    await act(async () => {
      await setInputhValue(countryComboboxElement, 'BJ');
    });

    await waitFor(() => {
      const currencySelectElement = screen.getByTestId('currency-select');
      const languageSelectElement = screen.getByTestId('language-select');
      expect(currencySelectElement.getAttribute('is-disabled')).not.toBe(
        'true',
      );
      expect(languageSelectElement.getAttribute('is-disabled')).toBe('true');
    });
  });

  it('should enable language input when a country and currency are selected', async () => {
    renderComponent();

    const countryComboboxElement = screen.getByTestId('country-combobox');

    await act(async () => {
      await setInputhValue(countryComboboxElement, 'BJ');
    });

    let currencySelectElement: HTMLElement;

    await waitFor(() => {
      currencySelectElement = screen.getByTestId('currency-select');
      expect(currencySelectElement.getAttribute('is-disabled')).not.toBe(
        'true',
      );
    });

    await act(async () => {
      await setInputhValue(currencySelectElement, 'EUR');
    });

    await waitFor(() => {
      const languageSelectElement = screen.getByTestId('language-select');
      expect(languageSelectElement.getAttribute('is-disabled')).not.toBe(
        'true',
      );
    });
  });

  it('should preselect currency and language if they have only one option', async () => {
    renderComponent();

    const countryComboboxElement = screen.getByTestId('country-combobox');

    await act(async () => {
      await setInputhValue(countryComboboxElement, 'GB');
    });

    await waitFor(() => {
      const currencySelectElement = screen.getByTestId('currency-select');
      const languageSelectElement = screen.getByTestId('language-select');
      expect(currencySelectElement.getAttribute('value')).toBe('GBP');
      expect(languageSelectElement.getAttribute('value')).toBe('en-GB');
    });
  });
});
