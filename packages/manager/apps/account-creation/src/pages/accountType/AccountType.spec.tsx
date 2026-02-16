import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as RulesHooks from '@/data/hooks/useRules';
import AccountTypePage from './AccountType.page';
import { Rule } from '@/types/rule';

vi.mock('@/data/api/me', () => ({
  putMe: vi.fn(() => Promise.resolve()),
}));

let legalForm: string | undefined;
const setLegalForm = vi.fn((form: string) => {
  legalForm = form;
});
const navigate = vi.fn();
const ovhSubsidiary = 'FR';
const language = 'fr-FR';

vi.spyOn(RulesHooks, 'useLegalFormRules').mockReturnValue({
  data: {
    fieldName: 'legalform',
    in: ['corporation', 'individual', 'association'],
    defaultValue: null,
    examples: null,
    mandatory: true,
    maxLength: null,
    minLength: null,
    prefix: null,
    regularExpression: null,
  },
  isLoading: false,
} as UseQueryResult<Rule>);

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useSearchParams: () => [
    new URLSearchParams({
      onsuccess: 'https://www.ovh.com/manager',
    }),
    vi.fn(),
  ],
}));

vi.mock('@/context/user/useUser', () => ({
    useUserContext: () => ({
      country: 'FR',
      ovhSubsidiary,
      legalForm,
      setLegalForm,
      language,
    }),
  }));

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const module: any = await importOriginal();
  return {
    ...module,
    OdsText: ({ children }: any) => <div>{children}</div>,
    OdsFormField: ({ children }: any) => <div>{children}</div>,
    OdsRadio: ({ ...props }: any) => (
      <input
        type="radio"
        {...props}
        data-testid={props.inputId}
        onChange={props.onOdsChange}
      />
    ),
    OdsButton: ({ ...props }: any) => <button {...props}>{props.label}</button>,
    OdsTooltip: () => <div data-testid="tooltip" />,
    OdsSkeleton: ({ ...props }: any) => (
      <div {...props} data-testid="skeleton" />
    ),
  };
});

const mockedTrackClick = vi.fn();
const mockedTrackPage = vi.fn();

vi.mock('@/context/tracking/useTracking', () => ({
  useTrackingContext: () => ({
    trackClick: mockedTrackClick,
    trackPage: mockedTrackPage,
  }),
}));

describe('AccountTypePage', () => {
  beforeEach(() => {
    legalForm = undefined;
    setLegalForm.mockClear();
  });

  it('should display radio button for each legal form given by the rules API', async () => {
    render(<AccountTypePage />);

    const corporationElement = screen.getAllByText('legal_form_corporation');
    const individualElement = screen.getAllByText('legal_form_individual');
    const associationElement = screen.getAllByText('legal_form_association');
    expect(corporationElement).toHaveLength(2);
    expect(individualElement).toHaveLength(2);
    expect(associationElement).toHaveLength(2);
  });

  it('should display an error message if user click on validate cta without making a choice', async () => {
    render(<AccountTypePage />);

    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    const errorMessageElement = screen.getByText('required_field');
    expect(errorMessageElement).toBeInTheDocument();
    expect(mockedTrackPage).toHaveBeenCalledWith({
      pageName: 'select-account-type_error_empty',
      pageType: 'banner-error',
      pageCategory: 'banner',
    });
  });

  it('should update the context with the selected legal form', async () => {
    render(<AccountTypePage />);

    const individualElement = screen.getByTestId('legal_form_individual');
    await act(() => individualElement.click());
    expect(legalForm).toBe('individual');
    expect(setLegalForm).toHaveBeenCalledWith('individual');
  });

  it('should navigate to company page for FR corporation', async () => {
    legalForm = 'corporation';
    render(<AccountTypePage />);

    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    expect(mockedTrackClick).toHaveBeenCalledWith(
      { pageName: 'page-name', pageType: 'page' },
      {
        location: 'page',
        buttonType: 'button',
        actions: [
          'account-create-select-account-type',
          'next',
          `${ovhSubsidiary}_${language}_${legalForm}`,
        ],
      },
    );
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith(
        '/company?onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager',
      ),
    );
  });

  it('should navigate to info page for FR non corporation', async () => {
    legalForm = 'individual';
    render(<AccountTypePage />);

    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    expect(mockedTrackClick).toHaveBeenCalledWith(
      { pageName: 'page-name', pageType: 'page' },
      {
        location: 'page',
        buttonType: 'button',
        actions: [
          'account-create-select-account-type',
          'next',
          `${ovhSubsidiary}_${language}_${legalForm}`,
        ],
      },
    );
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith(
        '/details?onsuccess=https%3A%2F%2Fwww.ovh.com%2Fmanager',
      ),
    );
  });
});
