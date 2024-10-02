import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@/utils/test.provider';
import { accountMock, domainMock, platformMock } from '@/api/_mock_';
import AddAndEditEmailAccount from '../AddAndEditEmailAccount';
import emailAccountAddAndEditTranslation from '@/public/translations/accounts/addAndEdit/Messages_fr_FR.json';

const { useSearchParamsMock } = vi.hoisted(() => ({
  useSearchParamsMock: vi.fn(() => [new URLSearchParams()]),
}));

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useDomains: vi.fn(() => ({
      data: domainMock,
      isLoading: false,
    })),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <AddAndEditEmailAccount />),
  useSearchParams: useSearchParamsMock,
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useQuery: useQueryMock,
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('email account add and edit page', () => {
  it('if there is not editEmailAccountId params', () => {
    const { getByTestId } = render(<AddAndEditEmailAccount />);
    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_add_title,
    );
  });

  it('if there is editEmailAccountId params', () => {
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editEmailAccountId: '19097ad4-2880-4000-8b03-9d110f0b8f80',
        }),
      ]),
    );
    useQueryMock.mockImplementation(
      vi.fn(() => ({
        data: accountMock[0],
        isLoading: false,
      })),
    );
    const { getByTestId } = render(<AddAndEditEmailAccount />);
    expect(getByTestId('page-title')).toHaveTextContent(
      emailAccountAddAndEditTranslation.zimbra_account_edit_title.replace(
        '{{ account }}',
        accountMock[0].currentState?.email,
      ),
    );
  });

  it('check validity form', () => {
    const { getByTestId } = render(<AddAndEditEmailAccount />);

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const inputPassword = getByTestId('input-password');

    expect(button).not.toBeEnabled();

    act(() => {
      inputAccount.odsInputBlur.emit({ name: 'account', value: '' });
      inputPassword.odsBlur.emit({ name: 'password', value: '' });
    });

    expect(inputAccount).toHaveAttribute('color', 'error');
    expect(inputPassword).toHaveAttribute('color', 'error');

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
    expect(inputPassword).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    act(() => {
      // Uppercased + digit + 10 characters total
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'Aaaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    act(() => {
      // No uppercased + digit or special + 10 characters total
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'aaaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('color', 'error');
    expect(button).not.toBeEnabled();

    act(() => {
      // Uppercased + special + 10 characters total
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'Aaaaaaaaa#',
      });
    });

    expect(inputPassword).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    act(() => {
      // Uppercased + digit or special but 9 characters total
      inputPassword.odsValueChange.emit({
        name: 'password',
        value: 'Aaaaaaaa1',
      });
    });

    expect(inputPassword).toHaveAttribute('color', 'error');
    expect(button).not.toBeEnabled();
  });
});
