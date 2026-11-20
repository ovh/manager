import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import * as RulesHooks from '@/data/hooks/useRules';
import * as MeHooks from '@/data/hooks/useMe';
import AccountDetailsPage from './accountDetails.page';
import { Rule, RuleField } from '@/types/rule';

const rule = (fieldName: RuleField, extra: Partial<Rule> = {}): Rule => ({
  fieldName,
  in: null,
  defaultValue: null,
  examples: null,
  mandatory: false,
  maxLength: null,
  minLength: null,
  prefix: null,
  regularExpression: null,
  ...extra,
});

let mockCountry = 'DE';

// Administration outside France: organisation + address mandatory, VAT optional
const rules = {
  legalform: rule('legalform', {
    in: ['corporation', 'individual', 'association', 'administration'],
    mandatory: true,
  }),
  firstname: rule('firstname', { mandatory: true }),
  name: rule('name', { mandatory: true }),
  organisation: rule('organisation', { mandatory: true }),
  address: rule('address', { mandatory: true }),
  zip: rule('zip', { mandatory: true }),
  city: rule('city', { mandatory: true }),
  country: rule('country', { in: ['DE'], mandatory: true }),
  vat: rule('vat'),
  companyNationalIdentificationNumber: rule(
    'companyNationalIdentificationNumber',
  ),
  phone: rule('phone'),
  language: rule('language', { in: ['de_DE'] }),
};

vi.spyOn(RulesHooks, 'useRules').mockReturnValue(({
  data: rules,
  isLoading: false,
  isEnabled: false,
  refetch: vi.fn(),
} as unknown) as ReturnType<typeof RulesHooks.useRules>);

vi.spyOn(MeHooks, 'useMe').mockReturnValue({
  data: {
    country: 'DE',
    language: 'de_DE',
    legalform: 'administration',
    ovhSubsidiary: 'DE',
    phoneCountry: 'DE',
  },
  isLoading: false,
} as UseQueryResult<any, any>);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: { changeLanguage: () => new Promise(() => {}), language: 'de_DE' },
  }),
  Trans: ({ i18nKey, children }: any) => children ?? i18nKey,
}));

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

vi.mock('@/context/user/useUser', () => ({
  useUserContext: () => ({
    legalForm: 'administration',
    country: mockCountry,
    ovhSubsidiary: 'DE',
    language: 'de-DE',
    companyDetails: { vatID: 'DE123' },
    isSMSConsentAvailable: false,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ header, children }: any) => (
    <div>
      <h1>{header.title}</h1>
      {children}
    </div>
  ),
  Links: () => null,
  LinkType: { back: 'back' },
  Notifications: () => null,
  OvhSubsidiary: { IN: 'IN' },
  useNotifications: () => ({ addError: vi.fn(), addSuccess: vi.fn() }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ButtonType: { button: 'button' },
  PageLocation: { page: 'page' },
  PageType: { bannerSuccess: 'banner-success' },
  usePageTracking: () => undefined,
}));

vi.mock('@/context/tracking/useTracking', () => ({
  useTrackingContext: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
}));

vi.mock('@/hooks/tracking/useTracking', () => ({
  useTrackError: () => ({ trackError: vi.fn() }),
  useTrackBackButtonClick: () => ({ trackBackButtonClick: vi.fn() }),
}));

vi.mock('@/hooks/redirection/useDetailsRedirection', () => ({
  useDetailsRedirection: () => ({
    url: 'https://www.ovh.com',
    isLoading: false,
  }),
}));

vi.mock('@/data/hooks/useEinvoicingRules', () => ({
  useEinvoicingRules: () => ({ data: undefined, refetch: vi.fn() }),
}));

vi.mock('@/components/exitGuard/ExitGuard.component', () => ({
  default: () => null,
}));

vi.mock(
  '@/components/invalidationRedirectGuard/InvalidationRedirectGuard.component',
  () => ({ default: ({ children }: any) => <>{children}</> }),
);

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const module: any = await importOriginal();
  return {
    ...module,
    OdsText: ({ children }: any) => <div>{children}</div>,
    OdsFormField: ({ children }: any) => <div>{children}</div>,
    OdsInput: (props: any) => (
      <input
        id={props.id}
        data-testid={props.id}
        value={props.value ?? ''}
        onChange={(e) => props.onOdsChange?.({ target: e.target })}
      />
    ),
    OdsSelect: ({ children }: any) => <select>{children}</select>,
    OdsCheckbox: (props: any) => (
      <input
        type="checkbox"
        data-testid={props.id}
        checked={props.isChecked}
        onChange={props.onClick}
      />
    ),
    OdsButton: (props: any) => (
      <button
        data-testid={props['data-testid']}
        type={props.type}
        disabled={props.isDisabled}
      >
        {props.label}
      </button>
    ),
  };
});

const renderPage = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <AccountDetailsPage />
    </QueryClientProvider>,
  );

describe('AccountDetailsPage', () => {
  beforeEach(() => {
    mockCountry = 'DE';
    renderPage();
  });

  it('should use the administration title', () => {
    expect(
      screen.getByText('account_details_title_administration'),
    ).toBeInTheDocument();
  });

  it('should mark organisation and address as mandatory but not the VAT', () => {
    expect(
      screen.getByText('account_details_field_corporation_name *'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('account_details_section_address_individual *'),
    ).toBeInTheDocument();
    expect(screen.getByText('account_details_field_vat')).toBeInTheDocument();
    expect(screen.queryByText('account_details_field_vat *')).toBeNull();
  });

  it('should not display the FR specific sections', () => {
    expect(screen.queryByText('account_details_field_siret')).toBeNull();
    expect(
      screen.queryByText('account_details_einvoicing_section_title'),
    ).toBeNull();
    expect(screen.queryByText('account_details_vat_select_no_vat')).toBeNull();
  });

  it('should block submit without organisation and allow it without VAT', async () => {
    const submit = screen.getByTestId('confirm-btn');
    const fill = async (id: string, value: string) =>
      act(async () => {
        fireEvent.change(screen.getByTestId(id), { target: { value } });
      });
    await fill('firstname', 'Jane');
    await fill('name', 'Doe');
    await fill('address', 'Rathausstrasse 15');
    await fill('zip', '10178');
    await fill('city', 'Berlin');
    await fill('vat', '');
    await act(async () => {
      fireEvent.click(screen.getByTestId('confirmSend'));
    });

    expect(submit).toBeDisabled();

    await fill('organisation', 'Stadt Berlin');

    expect(screen.getByTestId('vat')).toHaveValue('');
    expect(submit).toBeEnabled();
  });
});

describe('AccountDetailsPage in France', () => {
  it.each(['FR', 'GP'])(
    'should display the FR specific sections for %s',
    (country) => {
      mockCountry = country;
      renderPage();

      expect(
        screen.getByText('account_details_einvoicing_section_title'),
      ).toBeInTheDocument();
    },
  );
});
