import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { ServiceAccountsPolicyCount } from './ServiceAccountsPolicyCount.component';
import { useGetIamPoliciesForIdentity } from '@/data/hooks/useGetIamPolicies';
import { IamServiceAccount } from '@/data/api/iam-service-accounts';
import { IamPolicy } from '@/data/api/iam-policies';

vi.mock('@/data/hooks/useGetIamPolicies', () => ({
  useGetIamPoliciesForIdentity: vi.fn(),
}));

const MOCK_ACCOUNT: IamServiceAccount = {
  name: 'fake-account-1',
  description: 'Fake Account 1',
  clientId: 'fake-account-1',
  identity: 'fake-identity',
  createdAt: '2025-05-11T00:00:00+02:00',
}

const MOCK_POLICIES: IamPolicy[] = [{
  id: 'fake-policy-1',
  name: 'Fake Policy 1',
  description: 'Fake policy',
  owner: 'policy-owner',
  identities: [],
  resources: [],
  permissionsGroups: [],
  createdAt: '2025-05-11T00:00:00+02:00'
}];

describe('ServiceAccountsPolicyCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the number of associated policies', () => {
    vi.mocked(useGetIamPoliciesForIdentity).mockReturnValue({
      data: [MOCK_POLICIES],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetIamPoliciesForIdentity>);
    const { container } = render(<ServiceAccountsPolicyCount account={MOCK_ACCOUNT} />);
    expect(container).toHaveTextContent('1');
    expect(useGetIamPoliciesForIdentity).toHaveBeenCalledWith(MOCK_ACCOUNT.identity);
  });

  it('displays ods-skeleton while loading', () => {
    vi.mocked(useGetIamPoliciesForIdentity).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useGetIamPoliciesForIdentity>);
    const { container } = render(<ServiceAccountsPolicyCount account={MOCK_ACCOUNT} />);
    expect(container).toContainHTML('ods-skeleton');
  });

  it('displays no data if no policy is associated with account', () => {
    vi.mocked(useGetIamPoliciesForIdentity).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetIamPoliciesForIdentity>);
    const { container } = render(<ServiceAccountsPolicyCount account={MOCK_ACCOUNT} />);
    expect(container).toHaveTextContent('--');
  });

  it('displays no data if no identity is present in account', () => {
    const account: IamServiceAccount = {...MOCK_ACCOUNT, identity: null };
    vi.mocked(useGetIamPoliciesForIdentity).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetIamPoliciesForIdentity>);
    const { container } = render(<ServiceAccountsPolicyCount account={account} />);
    expect(container).toHaveTextContent('--');
  });
});
