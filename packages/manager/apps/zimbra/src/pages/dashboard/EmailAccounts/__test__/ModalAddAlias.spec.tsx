import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen } from '@/utils/test.provider';
import { accountMock, domainMock, platformMock } from '@/api/_mock_';
import ModalAddAlias from '../ModalAddAlias';
import emailAccountAliasAddTranslation from '@/public/translations/accounts/alias/add/Messages_fr_FR.json';

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
    useOrganization: vi.fn(() => ({
      data: null,
      isLoading: false,
    })),
    useAccount: vi.fn(() => ({
      data: accountMock[0],
      isLoading: false,
    })),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(() => ({
      pathname: `/00000000-0000-0000-0000-000000000001/email_accounts/alias/add?editEmailAccountId=${accountMock[0].id}`,
      search: '',
    })),
    useResolvedPath: vi.fn(() => '/:serviceName/email_accounts/alias/add'),
    useSearchParams: vi.fn(() => [
      new URLSearchParams({
        editEmailAccountId: '19097ad4-2880-4000-8b03-9d110f0b8f80',
      }),
    ]),
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
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('add alias modal', () => {
  it('if modal are displayed', () => {
    render(<ModalAddAlias />);
    screen.getByText(
      emailAccountAliasAddTranslation.zimbra_account_alias_add_description.replace(
        '{{ account }}',
        accountMock[0].currentState?.email,
      ),
    );
  });

  it('check validity form', () => {
    const { getByTestId } = render(<ModalAddAlias />);

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-alias');
    const selectDomain = getByTestId('select-domain');

    expect(button).not.toBeEnabled();

    act(() => {
      inputAccount.odsInputBlur.emit({ name: 'alias', value: '' });
    });

    expect(inputAccount).toHaveAttribute('color', 'error');

    act(() => {
      fireEvent.change(inputAccount, { target: { value: 'alias' } });
      fireEvent.change(selectDomain, { target: { value: 'domain' } });

      // it seems we have to manually trigger the ods event
      inputAccount.odsValueChange.emit({ name: 'alias', value: 'alias' });
      selectDomain.odsValueChange.emit({ name: 'domain', value: 'domain' });
    });

    expect(inputAccount).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();
  });
});
