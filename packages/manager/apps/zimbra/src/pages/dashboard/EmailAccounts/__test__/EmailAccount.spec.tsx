import React from 'react';
import { vi, describe, expect } from 'vitest';
import EmailAccounts from '../EmailAccounts';
import { render } from '@/utils/test.provider';
import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import { accountMock, platformMock, domainMock } from '@/api/_mock_';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
      platformUrn: platformMock[0].iam.urn,
    })),
    useAccountList: vi.fn(() => ({
      data: accountMock,
      isLoading: false,
    })),
    useDomains: vi.fn(() => ({
      data: domainMock,
      isLoading: false,
    })),
    useGenerateUrl: vi.fn(
      () => '#/00000000-0000-0000-0000-000000000001/email_accounts/add?',
    ),
    useOverridePage: vi.fn(() => false),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Notifications: vi.fn().mockReturnValue(<div>Notifications</div>),
    Datagrid: vi.fn().mockReturnValue(<div>Datagrid</div>),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('EmailAccounts page', () => {
  it('Page should display correctly', () => {
    const { getByTestId } = render(<EmailAccounts />);
    const button = getByTestId('add-account-btn');
    expect(button).toHaveAttribute(
      'href',
      '#/00000000-0000-0000-0000-000000000001/email_accounts/add?',
    );
    expect(button).toHaveTextContent(
      accountTranslation.zimbra_account_account_add,
    );
  });
});
