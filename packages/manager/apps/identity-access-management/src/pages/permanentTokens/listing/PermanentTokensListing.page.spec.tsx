import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import ReactRouterDom, { useParams } from 'react-router-dom';
import { createWrapper } from '@/test-utils/wrapperRender';

import Listing from './PermanentTokensListing.page';
import { useGetIamUser } from '@/data/hooks/useGetIamUser';
import { useIamUserTokenList } from '@/data/hooks/useGetIamUserTokens';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof ReactRouterDom = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('@/data/hooks/useGetIamUser', () => ({
  useGetIamUser: vi.fn(),
}));

vi.mock('@/data/hooks/useGetIamUserTokens', () => ({
  useIamUserTokenList: vi.fn(),
}));

const wrapper = createWrapper();

describe('Manage Tokens page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue(({
      userId: 'fakeUserId',
    }));
    vi.mocked(useGetIamUser).mockReturnValue({
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useGetIamUser>);
    vi.mocked(useIamUserTokenList).mockReturnValue({
      flattenData: [{
        name: 'fake_token_1',
        description: 'Fake Token 1',
        creation: '2025-05-11T00:00:00+02:00',
        lastUsed: '2025-06-11T00:00:00+02:00',
        expiresAt: '2025-06-11T00:00:00+02:00',
      }, {
        name: 'fake_token_2',
        description: 'Fake Token 2',
        creation: '2025-05-11T00:00:00+02:00',
        lastUsed: '2025-06-11T00:00:00+02:00',
        expiresAt: '2025-06-11T00:00:00+02:00',
      }],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useIamUserTokenList>);
  });

  it('displays Manage Tokens page', async () => {
    const { getByText } = render(<Listing />, { wrapper });
    expect(getByText('Fake Token 1')).toBeVisible();
    expect(getByText('Fake Token 2')).toBeVisible();
  });
});
