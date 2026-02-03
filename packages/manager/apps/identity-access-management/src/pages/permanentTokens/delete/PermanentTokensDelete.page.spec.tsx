import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReactRouterDom, { useParams } from 'react-router-dom';
import { createWrapper } from '@/test-utils/wrapperRender';

import { useDeleteIamUserToken } from '@/data/hooks/useGetIamUserTokens';
import PermanentTokensDelete from './PermanentTokensDelete.page';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof ReactRouterDom = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('@/data/hooks/useGetIamUserTokens', () => ({
  useDeleteIamUserToken: vi.fn(),
}));

const wrapper = createWrapper();

describe('PermanentTokenDelete', () => {
  const deleteTokenSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      userId: 'fakeUserId',
      tokenId: 'fake-token',
    });
    vi.mocked(useDeleteIamUserToken).mockReturnValue(({
      deleteToken: deleteTokenSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useDeleteIamUserToken>);
  });

  it('calls deleteToken on submit', () => {
    const { getByTestId } = render(<PermanentTokensDelete />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(deleteTokenSpy).toHaveBeenCalled();
  });

  it('does not submit when pending', () => {
    vi.mocked(useDeleteIamUserToken).mockReturnValue(({
      deleteToken: deleteTokenSpy,
      isPending: true,
    } as unknown) as ReturnType<typeof useDeleteIamUserToken>);
    const { getByTestId } = render(<PermanentTokensDelete />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(getByTestId('primary-button')).toHaveAttribute(
      'is-disabled',
      'true',
    );
    expect(deleteTokenSpy).not.toHaveBeenCalled();
  });
});
