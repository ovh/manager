import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import * as RulesHooks from '@/data/hooks/useRules';
import AccountTypePage from './AccountType.page';
import { Rule } from '@/types/rule';

let legalForm: string | undefined;
const setLegalForm = vi.fn((form: string) => {
  legalForm = form;
});
const navigate = vi.fn();

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

vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigate);

vi.mock('@/context/user/useUser', () => {
  return {
    useUserContext: () => ({
      country: 'FR',
      ovhSubsidiary: 'FR',
      legalForm,
      setLegalForm,
    }),
  };
});

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

describe('AccountTypePage', () => {
  beforeEach(() => {
    legalForm = undefined;
    setLegalForm.mockClear();
  });

  it('should display radio button for each legal form given by the rules API', async () => {
    render(<AccountTypePage />);

    const corporationElement = screen.getByText('legal_form_corporation');
    const individualElement = screen.getByText('legal_form_individual');
    const associationElement = screen.getByText('legal_form_association');
    expect(corporationElement).toBeInTheDocument();
    expect(individualElement).toBeInTheDocument();
    expect(associationElement).toBeInTheDocument();
  });

  it('should display an error message if user click on validate cta without making a choice', async () => {
    render(<AccountTypePage />);

    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    const errorMessageElement = screen.getByText('required_field');
    expect(errorMessageElement).toBeInTheDocument();
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
    expect(navigate).toHaveBeenCalledWith('/company');
  });

  it('should navigate to info page for FR non corporation', async () => {
    legalForm = 'individual';
    render(<AccountTypePage />);

    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    expect(navigate).toHaveBeenCalledWith('/details');
  });
});
