import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { createWrapper } from '@/test-utils/wrapperRender';

import Listing from './ServiceAccountsListing.page';
import { useIamServiceAccountList } from '@/data/hooks/useGetIamServiceAccounts';
import { IamServiceAccountFlow } from '@/data/api/iam-service-accounts';

vi.mock('@/data/hooks/useGetIamServiceAccounts', () => ({
  useIamServiceAccountList: vi.fn(),
}));

const wrapper = createWrapper();

describe('Service Accounts page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useIamServiceAccountList).mockReturnValue({
      flattenData: [{
        name: 'fake_account_1',
        description: 'Fake Account 1',
        clientId: 'fake-account-1',
        flow: IamServiceAccountFlow.CLIENT_CREDENTIALS,
        identity: null,
        createdAt: '2025-05-11T00:00:00+02:00',
      }, {
        name: 'fake_account_2',
        description: 'Fake Account 2',
        clientId: 'fake-account-2',
        flow: IamServiceAccountFlow.CLIENT_CREDENTIALS,
        identity: null,
        createdAt: '2025-05-11T00:00:00+02:00',
      }, {
        name: 'fake_account_3',
        description: 'Fake Account 3',
        clientId: 'fake-account-3',
        flow: IamServiceAccountFlow.AUTHORIZATION_CODE,
        identity: null,
        createdAt: '2025-05-11T00:00:00+02:00',
      }],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useIamServiceAccountList>);
  });

  it('displays client credentials items', async () => {
    const { getByText } = render(<Listing />, { wrapper });
    expect(getByText('Fake Account 1')).toBeVisible();
    expect(getByText('Fake Account 2')).toBeVisible();
  });

  it('does not displays authorization code items', async () => {
    const { queryByText } = render(<Listing />, { wrapper });
    expect(queryByText('Fake Account 3')).toBeFalsy();
  });
});
