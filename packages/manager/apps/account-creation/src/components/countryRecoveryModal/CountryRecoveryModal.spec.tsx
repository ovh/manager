import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import * as RulesHooks from '@/data/hooks/useRules';
import * as MeHooks from '@/data/hooks/useMe';
import * as FlowHelper from '@/helpers/flowHelper';
import * as LocalCountryHooks from '@/hooks/useLocalCountry/useLocalCountry';
import CountryRecoveryModal from './CountryRecoveryModal.component';
import { Rule } from '@/types/rule';

const setCountry = vi.fn();
// The account creation flow sets the context country to the `UNKNOWN` sentinel
// when it is lost; a real code means the flow recovered.
let country: string | undefined;
const ovhSubsidiary = 'FR';

vi.mock('@/context/user/useUser', () => ({
  useUserContext: () => ({
    country,
    ovhSubsidiary,
    setCountry,
  }),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/type' }),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Modal: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  ModalContent: ({ children }: any) => <div>{children}</div>,
  ModalHeader: ({ children }: any) => <div>{children}</div>,
  ModalBody: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const module: any = await importOriginal();
  return {
    ...module,
    OdsText: ({ children }: any) => <div>{children}</div>,
    OdsFormField: ({ children }: any) => <div>{children}</div>,
    OdsButton: ({ ...props }: any) => (
      <button {...props} disabled={props.isDisabled} onClick={props.onClick}>
        {props.label}
      </button>
    ),
    OdsCombobox: ({ children, onOdsChange, ...props }: any) => (
      <select
        {...props}
        data-testid={props['data-testid']}
        onChange={(e) => onOdsChange({ detail: { value: e.target.value } })}
      >
        <option value="" />
        {children}
      </select>
    ),
    OdsComboboxItem: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),
  };
});

const countryRule: Rule = {
  fieldName: 'country',
  in: ['FR', 'GB', 'DE'],
  defaultValue: null,
  examples: null,
  mandatory: true,
  maxLength: null,
  minLength: null,
  prefix: null,
  regularExpression: null,
};

const mockRules = (data: Partial<Record<'country', Rule>> | undefined) =>
  vi.spyOn(RulesHooks, 'useRules').mockReturnValue({
    data,
    isLoading: false,
  } as ReturnType<typeof RulesHooks.useRules>);

describe('CountryRecoveryModal', () => {
  beforeEach(() => {
    setCountry.mockClear();
    country = 'UNKNOWN';
    vi.spyOn(FlowHelper, 'isUserLoggedIn').mockReturnValue(true);
    vi.spyOn(MeHooks, 'useMe').mockReturnValue({
      data: { country: 'UNKNOWN', ovhSubsidiary },
      isFetched: true,
    } as any);
    vi.spyOn(LocalCountryHooks, 'useLocalCountry').mockReturnValue([
      undefined,
      vi.fn(),
      vi.fn(),
    ]);
    mockRules({ country: countryRule });
  });

  it('should not render when the API returns a usable country', () => {
    vi.spyOn(MeHooks, 'useMe').mockReturnValue({
      data: { country: 'FR', ovhSubsidiary },
      isFetched: true,
    } as any);
    const { container } = render(<CountryRecoveryModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render when a country is still persisted locally', () => {
    vi.spyOn(LocalCountryHooks, 'useLocalCountry').mockReturnValue([
      'FR',
      vi.fn(),
      vi.fn(),
    ]);
    const { container } = render(<CountryRecoveryModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render when the user is not logged in', () => {
    vi.spyOn(FlowHelper, 'isUserLoggedIn').mockReturnValue(false);
    const { container } = render(<CountryRecoveryModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the modal with the countries restricted by the subsidiary rules', () => {
    render(<CountryRecoveryModal />);
    const combobox = screen.getByTestId('recovery-country-combobox');
    expect(combobox).toBeInTheDocument();
    // 3 allowed countries + the empty placeholder option
    expect(combobox.querySelectorAll('option')).toHaveLength(4);
  });

  it('should keep the validate button disabled until a country is selected', () => {
    render(<CountryRecoveryModal />);
    const button = screen.getByTestId('recovery-validate-button');
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByTestId('recovery-country-combobox'), {
      target: { value: 'DE' },
    });
    expect(button).not.toBeDisabled();
  });

  it('should persist the selected country when validating', () => {
    render(<CountryRecoveryModal />);
    fireEvent.change(screen.getByTestId('recovery-country-combobox'), {
      target: { value: 'DE' },
    });
    fireEvent.click(screen.getByTestId('recovery-validate-button'));
    expect(setCountry).toHaveBeenCalledWith('DE');
  });

  it('should close once a real country has been recovered in the context', () => {
    country = 'DE';
    const { container } = render(<CountryRecoveryModal />);
    expect(container).toBeEmptyDOMElement();
  });
});
