import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userContext, { UserContext } from '@/context/user/user.context';
import { getRules, RulesParam } from '@/data/api/rules';
import { getGermanRegistersByCourt } from '@/data/api/suggestion';
import { putMe } from '@/data/api/me';
import { Rule } from '@/types/rule';
import { GermanRegisterCourtList } from '@/types/suggestion';
import AccountDetailsPage from './accountDetails.page';

/*
 * Account creation, German head office (MANAGER-23141, spec « 06 Germany
 * Customer Master Data: Front End »). `POST /newAccount/rules` is mocked per
 * legal form as the API answers: which identifiers show and their formats are
 * the rules'; the page adds the order, the « no USt-IdNr. » box, the register
 * id built from a court and a number, and the Company « at least one ».
 */

const mocks = vi.hoisted(() => ({
  me: {} as Record<string, unknown>,
  vatMandatory: false,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) =>
      options?.name ? `${key}:${options.name}` : key,
    i18n: { language: 'de_DE' },
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

vi.mock('@/data/api/rules', () => ({ getRules: vi.fn() }));
vi.mock('@/data/api/suggestion', () => ({
  getGermanRegistersByCourt: vi.fn(),
}));
vi.mock('@/data/api/me', () => ({ putMe: vi.fn() }));
vi.mock('@/data/api/marketing', () => ({ putSmsConsent: vi.fn() }));
vi.mock('@/data/hooks/useMe', () => ({
  useMe: () => ({ data: mocks.me, isLoading: false }),
}));
vi.mock('@/hooks/redirection/useDetailsRedirection', () => ({
  useDetailsRedirection: () => ({ url: '#done', isLoading: false }),
}));
vi.mock('@/hooks/tracking/useTracking', () => ({
  useTrackError: () => ({ trackError: vi.fn() }),
  useTrackBackButtonClick: () => ({ trackBackButtonClick: vi.fn() }),
}));
vi.mock('@/context/tracking/useTracking', () => ({
  useTrackingContext: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
}));
vi.mock('@/components/exitGuard/ExitGuard.component', () => ({
  default: () => null,
}));
vi.mock(
  '@/components/invalidationRedirectGuard/InvalidationRedirectGuard.component',
  () => ({ default: ({ children }: { children: ReactNode }) => children }),
);
vi.mock('@ovh-ux/manager-react-components', () => ({
  BaseLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Links: () => null,
  LinkType: { back: 'back' },
  Notifications: () => null,
  OvhSubsidiary: { IN: 'IN' },
  useNotifications: () => ({ addError: vi.fn(), addSuccess: vi.fn() }),
}));
vi.mock('@ovhcloud/ods-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ovhcloud/ods-react')>()),
  PhoneNumber: () => null,
  PhoneNumberControl: () => null,
  PhoneNumberCountryList: () => null,
}));

/* eslint-disable @typescript-eslint/no-explicit-any */
vi.mock('@ovhcloud/ods-components/react', () => {
  const odsEvent = (event: any) => ({
    detail: { value: event.target.value },
    target: event.target,
  });
  return {
    OdsFormField: ({ children }: any) => <div>{children}</div>,
    OdsText: ({ children }: any) => <span>{children}</span>,
    OdsMessage: ({ children, color }: any) => (
      <div role="status" data-color={color}>
        {children}
      </div>
    ),
    OdsSkeleton: () => <div />,
    OdsRadio: () => null,
    OdsDatepicker: () => null,
    OdsInput: (props: any) => (
      <input
        id={props.id}
        name={props.name}
        value={props.value ?? ''}
        readOnly={props.isReadonly}
        onChange={(event) => props.onOdsChange?.(odsEvent(event))}
        onBlur={(event) => {
          props.onOdsBlur?.(event);
          props.onBlur?.(event);
        }}
      />
    ),
    OdsSelect: (props: any) => (
      <select
        id={props.id}
        name={props.name}
        value={props.value ?? ''}
        disabled={props.isDisabled}
        onChange={(event) => props.onOdsChange?.(odsEvent(event))}
        onBlur={(event) => props.onOdsBlur?.(event)}
      >
        {/* As ODS 18: no empty choice of its own. */}
        {props.children}
      </select>
    ),
    OdsCheckbox: (props: any) => (
      <input
        type="checkbox"
        id={props.inputId}
        name={props.name}
        checked={Boolean(props.isChecked)}
        onChange={() => {}}
        onClick={props.onClick}
      />
    ),
    OdsButton: (props: any) => (
      <button
        type={props.type}
        disabled={props.isDisabled}
        data-testid={props['data-testid']}
      >
        {props.label}
      </button>
    ),
  };
});
/* eslint-enable @typescript-eslint/no-explicit-any */

const COURTS = ({
  registerTypes: ['HRA', 'HRB', 'GnR', 'PR', 'VR', 'GsR'],
  courts: [
    {
      code: 'D2601V',
      name: 'Amtsgericht München',
      registers: ['HRA', 'HRB', 'GnR', 'PR', 'VR', 'GsR'],
    },
    {
      code: 'R3306',
      name: 'Amtsgericht Köln',
      registers: ['HRA', 'HRB', 'GnR', 'VR', 'GsR'],
    },
    { code: 'F1103', name: 'Amtsgericht Charlottenburg', registers: ['VR'] },
    {
      code: 'F1103R',
      name: 'Amtsgericht Charlottenburg',
      registers: ['HRA', 'HRB', 'GnR', 'PR', 'GsR'],
    },
  ],
} as unknown) as GermanRegisterCourtList;

const rule = (fieldName: string, over: Partial<Rule> = {}): Rule => ({
  fieldName: fieldName as Rule['fieldName'],
  mandatory: false,
  defaultValue: null,
  examples: null,
  in: null,
  maxLength: null,
  minLength: null,
  prefix: null,
  regularExpression: null,
  ...over,
});

/** The German identifiers per legal form, as the rules describe them. */
const germanRules = (legalform?: string) => {
  if (!legalform || legalform === 'individual') return [];
  const register = legalform === 'association' ? 'VR' : '(HRA|HRB|GnR|PR|GsR)';
  return [
    rule('organisation', { mandatory: true, maxLength: 60 }),
    rule('nationalIdentificationNumber', {
      regularExpression: '^DE[0-9]{9}-[0-9]{5}$',
    }),
    ...(legalform === 'administration'
      ? []
      : [
          rule('companyNationalIdentificationNumber', {
            regularExpression: `^DE[A-Z][0-9]{4}[RV]?\\.${register}[0-9]{1,9}[A-Z]{0,3}$`,
          }),
        ]),
    rule('vat', {
      mandatory: mocks.vatMandatory,
      regularExpression: '^DE[0-9]{9}$',
    }),
  ];
};

const rulesFor = (params: RulesParam) =>
  Object.fromEntries(
    [
      rule('country', { mandatory: true, in: ['DE'] }),
      rule('language', { mandatory: true, in: ['de_DE'] }),
      ...(params.country === 'DE' ? germanRules(params.legalform) : []),
    ].map((entry) => [entry.fieldName, entry]),
  );

const renderPage = (legalForm: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const context = ({
    legalForm,
    country: 'DE',
    ovhSubsidiary: 'DE',
    language: 'de_DE',
    isSMSConsentAvailable: false,
    setLegalForm: vi.fn(),
    setCountry: vi.fn(),
    setCompany: vi.fn(),
  } as unknown) as UserContext;
  return render(
    <QueryClientProvider client={queryClient}>
      <userContext.Provider value={context}>
        <MemoryRouter>
          <AccountDetailsPage />
        </MemoryRouter>
      </userContext.Provider>
    </QueryClientProvider>,
  );
};

const textbox = (name: string) => screen.getByRole('textbox', { name });
const type = (name: string, value: string) =>
  fireEvent.change(textbox(name), { target: { value } });
const courtSelect = () =>
  screen.getByRole('combobox', { name: 'account_details_de_court_label' });
const pickCourt = (code: string) =>
  fireEvent.change(courtSelect(), { target: { value: code } });
const courtLabels = () =>
  within(courtSelect())
    .getAllByRole('option')
    .slice(1)
    .map((option) => option.textContent);
const confirmButton = () => screen.getByTestId('confirm-btn');

const NIN = 'account_details_de_nin_label';
const REGISTER = 'account_details_de_cnin_label';
const VAT = 'account_details_field_vat';

/** The page with its rules in, and the mandatory fields filled. */
const openPage = async (legalForm: string) => {
  const view = renderPage(legalForm);
  await screen.findByRole('textbox', {
    name: 'account_details_field_corporation_name',
  });
  type('account_details_field_corporation_name', 'ACME GmbH');
  fireEvent.click(
    screen.getByRole('checkbox', {
      name: 'account_details_field_confirm_send',
    }),
  );
  return view;
};

const sentBody = async () => {
  await waitFor(() => expect(confirmButton()).toBeEnabled());
  fireEvent.click(confirmButton());
  await waitFor(() => expect(putMe).toHaveBeenCalledTimes(1));
  return vi.mocked(putMe).mock.calls[0][0] as Record<string, unknown>;
};

describe('AccountDetailsPage — German head office', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.vatMandatory = false;
    mocks.me = {
      country: 'DE',
      language: 'de_DE',
      ovhSubsidiary: 'DE',
      phoneCountry: 'DE',
    };
    vi.mocked(getRules).mockImplementation(async (params) => rulesFor(params));
    vi.mocked(getGermanRegistersByCourt).mockResolvedValue(COURTS);
    vi.mocked(putMe).mockResolvedValue({} as never);
  });

  it.each([
    // legal form, info block, register id
    ['corporation', true, true],
    ['personalcorporation', false, true],
    ['association', false, true],
    ['administration', false, false],
  ])(
    '%s: shows the identifiers its rules describe, in the spec order',
    async (legalForm, info, register) => {
      renderPage(legalForm);
      await screen.findByRole('textbox', { name: VAT });
      expect(getRules).toHaveBeenLastCalledWith(
        expect.objectContaining({ country: 'DE', legalform: legalForm }),
      );
      expect(screen.queryByText('account_details_de_info') !== null).toBe(info);
      expect(screen.queryByRole('textbox', { name: REGISTER }) !== null).toBe(
        register,
      );
      const box = screen.getByRole('checkbox', {
        name: `account_details_de_no_vat_${legalForm}`,
      });
      expect(box).not.toBeChecked();
      // Spec §2: W-IdNr., register id, box, USt-IdNr.
      const order = [
        textbox(NIN),
        ...(register ? [courtSelect(), textbox(REGISTER)] : []),
        box,
        textbox(VAT),
      ];
      const controls = Array.from(
        document.body.querySelectorAll('input, select'),
      );
      const positions = order.map((element) => controls.indexOf(element));
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
      // One court list call, only when the register id shows.
      expect(getGermanRegistersByCourt).toHaveBeenCalledTimes(register ? 1 : 0);
    },
  );

  it('individual: no identifier, no box', async () => {
    renderPage('individual');
    await screen.findByTestId('confirm-btn');
    expect(screen.queryByRole('textbox', { name: NIN })).toBeNull();
    expect(screen.queryByRole('textbox', { name: REGISTER })).toBeNull();
    expect(screen.queryByRole('textbox', { name: VAT })).toBeNull();
    expect(screen.queryByRole('checkbox', { name: /no_vat/ })).toBeNull();
    expect(getGermanRegistersByCourt).not.toHaveBeenCalled();
  });

  it('offers the courts keeping the register type typed', async () => {
    await openPage('corporation');
    await waitFor(() => expect(courtSelect()).toBeEnabled());
    expect(courtLabels()).toEqual([
      'Amtsgericht München',
      'Amtsgericht Köln',
      'Amtsgericht Charlottenburg (F1103)',
      'Amtsgericht Charlottenburg (F1103R)',
    ]);
    type(REGISTER, 'pr 45');
    expect(courtLabels()).toEqual([
      'Amtsgericht München',
      'Amtsgericht Charlottenburg (F1103R)',
    ]);
    // A court picked, then a type it does not keep: kept, flagged.
    type(REGISTER, 'HRB 1');
    pickCourt('R3306');
    type(REGISTER, 'PR 1');
    expect(courtLabels().at(-1)).toBe(
      'account_details_de_court_unavailable:Amtsgericht Köln',
    );
  });

  it('sends the register id as one EUID', async () => {
    await openPage('corporation');
    await waitFor(() => expect(courtSelect()).toBeEnabled());
    type(REGISTER, 'hrb 12345');
    pickCourt('D2601V');
    type(VAT, 'DE 123 456 789');
    const body = await sentBody();
    expect(body).toEqual(
      expect.objectContaining({
        organisation: 'ACME GmbH',
        companyNationalIdentificationNumber: 'DED2601V.HRB12345',
        vat: 'DE123456789',
      }),
    );
  });

  it('blocks a register id with one part only', async () => {
    await openPage('corporation');
    type(VAT, 'DE123456789');
    await waitFor(() => expect(confirmButton()).toBeEnabled());

    type(REGISTER, 'HRB 12345');
    expect(
      screen.getByText('account_details_de_error_court_required'),
    ).toBeInTheDocument();
    await waitFor(() => expect(confirmButton()).toBeDisabled());

    type(REGISTER, '');
    await waitFor(() => expect(courtSelect()).toBeEnabled());
    pickCourt('D2601V');
    expect(
      screen.getByText('account_details_de_error_cnin_required'),
    ).toBeInTheDocument();
    await waitFor(() => expect(confirmButton()).toBeDisabled());

    // A court picked by mistake can be taken back off.
    pickCourt('none');
    expect(courtSelect()).toHaveValue('none');
    await waitFor(() => expect(confirmButton()).toBeEnabled());

    pickCourt('D2601V');
    type(REGISTER, 'HRB 12345');
    await waitFor(() => expect(confirmButton()).toBeEnabled());
  });

  it('checks the EUID against the rule of the legal form', async () => {
    // A non-profit keeps a VR register only: an HRB is refused by its rule.
    await openPage('association');
    type(VAT, 'DE123456789');
    await waitFor(() => expect(courtSelect()).toBeEnabled());
    pickCourt('D2601V');
    type(REGISTER, 'HRB 12345');
    fireEvent.blur(textbox(REGISTER));
    expect(await screen.findByText('error_pattern')).toBeInTheDocument();
    expect(confirmButton()).toBeDisabled();
    type(REGISTER, 'VR 12345');
    await waitFor(() => expect(screen.queryByText('error_pattern')).toBeNull());
    expect(await sentBody()).toEqual(
      expect.objectContaining({
        companyNationalIdentificationNumber: 'DED2601V.VR12345',
      }),
    );
  });

  it('asks a USt-IdNr. or the box ticked; ticked, sends the VAT empty', async () => {
    await openPage('association');
    const box = screen.getByRole('checkbox', {
      name: 'account_details_de_no_vat_association',
    });
    type(VAT, 'DE12');
    // Ticked: hidden and emptied.
    fireEvent.click(box);
    expect(screen.queryByRole('textbox', { name: VAT })).toBeNull();
    // Unticked: asked again, and said so.
    fireEvent.click(box);
    expect(textbox(VAT)).toHaveValue('');
    expect(
      await screen.findByText('account_details_de_error_vat_required_or_tick'),
    ).toBeInTheDocument();
    expect(confirmButton()).toBeDisabled();

    fireEvent.click(box);
    expect((await sentBody()).vat).toBe('');
  });

  it('does not check a mandatory USt-IdNr. rule while the box is ticked', async () => {
    mocks.vatMandatory = true;
    await openPage('corporation');
    type(NIN, 'DE123456789-00001');
    // The keystroke's validation ends before a user's click can come.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(confirmButton()).toBeDisabled();
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'account_details_de_no_vat_corporation',
      }),
    );
    expect((await sentBody()).vat).toBe('');
  });

  it('asks a Company for at least one identifier — the box is none', async () => {
    await openPage('corporation');
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'account_details_de_no_vat_corporation',
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByText('account_details_de_info').closest('[role=status]'),
      ).toHaveAttribute('data-color', 'critical'),
    );
    expect(confirmButton()).toBeDisabled();

    type(NIN, 'DE123456789-00001');
    const body = await sentBody();
    expect(body).toEqual(
      expect.objectContaining({
        nationalIdentificationNumber: 'DE123456789-00001',
        vat: '',
      }),
    );
  });

  it('shows an error when the court list cannot be loaded', async () => {
    vi.mocked(getGermanRegistersByCourt).mockRejectedValue(
      new Error('Not found'),
    );
    await openPage('corporation');
    expect(
      await screen.findByText('account_details_de_court_list_error'),
    ).toBeInTheDocument();
    expect(courtSelect()).toBeDisabled();
    // The other identifiers still let the customer go on.
    type(VAT, 'DE123456789');
    expect((await sentBody()).vat).toBe('DE123456789');
  });

  it('follows the rules of a new legal form after a change of account type', async () => {
    const corporation = await openPage('corporation');
    await waitFor(() => expect(courtSelect()).toBeEnabled());
    type(REGISTER, 'HRB 12345');
    pickCourt('D2601V');
    // Back to the account type step: the details page is left…
    corporation.unmount();

    // …and opened again for the new legal form, with its rules.
    await openPage('administration');
    expect(getRules).toHaveBeenLastCalledWith(
      expect.objectContaining({ legalform: 'administration' }),
    );
    expect(screen.queryByRole('textbox', { name: REGISTER })).toBeNull();
    type(VAT, 'DE123456789');
    const body = await sentBody();
    expect(body).not.toHaveProperty('companyNationalIdentificationNumber');
  });

  it('individual: sends empty the identifiers /me holds', async () => {
    mocks.me = {
      ...mocks.me,
      vat: 'DE123456789',
      companyNationalIdentificationNumber: 'DED2601V.HRB1',
      nationalIdentificationNumber: '',
    };
    renderPage('individual');
    fireEvent.click(
      await screen.findByRole('checkbox', {
        name: 'account_details_field_confirm_send',
      }),
    );
    const body = await sentBody();
    expect(body).toEqual(
      expect.objectContaining({
        vat: '',
        companyNationalIdentificationNumber: '',
      }),
    );
    expect(body).not.toHaveProperty('nationalIdentificationNumber');
  });
});
