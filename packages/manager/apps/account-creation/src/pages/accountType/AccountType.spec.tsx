import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import * as RulesHooks from '@/data/hooks/useRules';
import AccountTypePage from './AccountType.page';
import userContext, { UserContext } from '@/context/user/user.context';
import { Rule } from '@/types/rule';

const mocks = vi.hoisted(() => ({
  country: 'FR',
  ovhSubsidiary: 'FR',
  setLegalForm: vi.fn(),
}));
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

const renderComponent = () =>
  render(
    <userContext.Provider value={(mocks as unknown) as UserContext}>
      <AccountTypePage />
    </userContext.Provider>,
  );

describe('AccountTypePage', () => {
  it('should display radio button for each legal form given by the rules API', async () => {
    renderComponent();

    const corporationElement = screen.getByText('legal_form_corporation');
    const individualElement = screen.getByText('legal_form_individual');
    const associationElement = screen.getByText('legal_form_association');
    expect(corporationElement).toBeInTheDocument();
    expect(individualElement).toBeInTheDocument();
    expect(associationElement).toBeInTheDocument();
  });

  it('should display an error message if user click on validate cta without making a choice', async () => {
    renderComponent();

    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    const errorMessageElement = screen.getByText('required_field');
    expect(errorMessageElement).toBeInTheDocument();
  });

  it('should update the context with the selected legal form', async () => {
    renderComponent();

    const individualElement = screen.getByTestId('legal_form_individual');
    await act(() => individualElement.click());
    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    expect(mocks.setLegalForm).toHaveBeenCalledWith('individual');
  });

  it('should navigation to company page for FR corporation', async () => {
    renderComponent();

    const individualElement = screen.getByTestId('legal_form_corporation');
    await act(() => individualElement.click());
    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    expect(navigate).toHaveBeenCalledWith('/company');
  });

  it('should navigation to info page for FR non corporation', async () => {
    renderComponent();

    const individualElement = screen.getByTestId('legal_form_individual');
    await act(() => individualElement.click());
    const validateButtonElement = screen.getByText('validate');
    await act(() => validateButtonElement.click());
    expect(navigate).toHaveBeenCalledWith('/details');
  });
});
