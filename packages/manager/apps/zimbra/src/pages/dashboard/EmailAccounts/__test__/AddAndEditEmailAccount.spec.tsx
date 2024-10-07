import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@/utils/test.provider';
import { accountMock, domainMock, platformMock } from '@/api/_mock_';
import AddAndEditEmailAccount from '../AddAndEditEmailAccount.page';
import emailAccountAddAndEditTranslation from '@/public/translations/accounts/addAndEdit/Messages_fr_FR.json';
import emailAccountAliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';

const { useSearchParamsMock } = vi.hoisted(() => ({
  useSearchParamsMock: vi.fn(() => [new URLSearchParams()]),
}));

const { useLocationMock } = vi.hoisted(() => ({
  useLocationMock: vi.fn(() => ({
    pathname: '/00000000-0000-0000-0000-000000000001/email_accounts/add',
    search: '',
  })),
}));

const { useAccountMock } = vi.hoisted(() => ({
  useAccountMock: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
      platformUrn: platformMock[0].iam.urn,
    })),
    useGenerateUrl: vi.fn(),
    useDomains: vi.fn(() => ({
      data: domainMock,
      isLoading: false,
    })),
    useOrganization: vi.fn(() => ({
      data: null,
      isLoading: false,
    })),
    useAccount: useAccountMock,
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: useLocationMock,
    useResolvedPath: vi.fn(() => '/:serviceName/email_accounts'),
    useSearchParams: useSearchParamsMock,
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
    Datagrid: vi.fn().mockReturnValue(<div>Datagrid</div>),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('email account add and edit page', () => {
  it('if there is not editEmailAccountId params', () => {
    useAccountMock.mockImplementation(
      vi.fn(() => ({
        data: null,
        isLoading: false,
      })),
    );
    const { getByTestId } = render(<AddAndEditEmailAccount />);
    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_add_title,
    );
  });

  it('if there is editEmailAccountId params', () => {
    useAccountMock.mockImplementation(
      vi.fn(() => ({
        data: accountMock[0],
        isLoading: false,
      })),
    );
    useLocationMock.mockImplementation(
      vi.fn(() => ({
        pathname:
          '/00000000-0000-0000-0000-000000000001/email_accounts/settings?editEmailAccountId=19097ad4-2880-4000-8b03-9d110f0b8f80',
        search: '',
      })),
    );
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editEmailAccountId: '19097ad4-2880-4000-8b03-9d110f0b8f80',
        }),
      ]),
    );
    const { getByTestId } = render(<AddAndEditEmailAccount />);
    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_edit_title.replace(
        '{{ account }}',
        accountMock[0].currentState?.email,
      ),
    );
  });

  it('test alias tabs page', () => {
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editEmailAccountId: '19097ad4-2880-4000-8b03-9d110f0b8f80',
        }),
      ]),
    );
    useLocationMock.mockImplementation(
      vi.fn(() => ({
        pathname: '/00000000-0000-0000-0000-000000000001/email_accounts/alias',
        search: '',
      })),
    );
    const { getByText } = render(<AddAndEditEmailAccount />);

    expect(
      getByText(emailAccountAliasTranslation.zimbra_account_alias_title),
    ).toBeInTheDocument();
  });

  it('should display redirection tab page', () => {
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editEmailAccountId: '19097ad4-2880-4000-8b03-9d110f0b8f80',
        }),
      ]),
    );
    useLocationMock.mockImplementation(
      vi.fn(() => ({
        pathname:
          '/00000000-0000-0000-0000-000000000001/email_accounts/redirections',
        search: '',
      })),
    );
    const { getByText } = render(<AddAndEditEmailAccount />);

    expect(
      getByText(redirectionsTranslation.zimbra_redirections_account_title),
    ).toBeInTheDocument();
  });

  it('check validity form', () => {
    useLocationMock.mockImplementation(
      vi.fn(() => ({
        pathname:
          '/00000000-0000-0000-0000-000000000001/email_accounts/settings?editEmailAccountId=19097ad4-2880-4000-8b03-9d110f0b8f80',
        search: '',
      })),
    );
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editEmailAccountId: '19097ad4-2880-4000-8b03-9d110f0b8f80',
        }),
      ]),
    );
    const { getByTestId } = render(<AddAndEditEmailAccount />);

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const inputPassword = getByTestId('input-password');

    expect(button).not.toBeEnabled();

    act(() => {
      inputAccount.odsInputBlur.emit({ name: 'account', value: '' });
    });

    expect(inputAccount).toHaveAttribute('color', 'error');

    act(() => {
      fireEvent.change(inputAccount, { target: { value: 'account' } });
      fireEvent.change(selectDomain, { target: { value: 'domain' } });
      fireEvent.change(inputPassword, {
        target: { value: 'PasswordWithGoodPattern1&' },
      });
      // it seems we have to manually trigger the ods event
      inputAccount.odsValueChange.emit({ name: 'account', value: 'account' });
      selectDomain.odsValueChange.emit({ name: 'domain', value: 'domain' });
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'PasswordWithGoodPattern1&',
      });
    });

    expect(inputAccount).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    act(() => {
      fireEvent.change(inputPassword, {
        target: { value: 'PasswordWithGoodPattern1&' },
      });
      // it seems we have to manually trigger the ods event
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'PasswordWithoutGoodPattern',
      });
    });
    expect(button).not.toBeEnabled();
  });
});
