import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReactRouterDom, { useParams } from 'react-router-dom';
import { createWrapper } from '@/test-utils/wrapperRender';

import { useDeleteIamServiceAccount } from '@/data/hooks/useGetIamServiceAccounts';
import ServiceAccountsDelete from './ServiceAccountsDelete.page';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof ReactRouterDom = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('@/data/hooks/useGetIamServiceAccounts', () => ({
  useDeleteIamServiceAccount: vi.fn(),
}));

const wrapper = createWrapper();

describe('ServiceAccountsDelete', () => {
  const deleteServiceAccountSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      clientId: 'fake-client-id',
    });
    vi.mocked(useDeleteIamServiceAccount).mockReturnValue(({
      deleteServiceAccount: deleteServiceAccountSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useDeleteIamServiceAccount>);
  });

  it('calls deleteToken on submit', () => {
    const { getByTestId } = render(<ServiceAccountsDelete />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(deleteServiceAccountSpy).toHaveBeenCalled();
  });

  it('does not submit when pending', () => {
    vi.mocked(useDeleteIamServiceAccount).mockReturnValue(({
      deleteToken: deleteServiceAccountSpy,
      isPending: true,
    } as unknown) as ReturnType<typeof useDeleteIamServiceAccount>);
    const { getByTestId } = render(<ServiceAccountsDelete />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(getByTestId('primary-button')).toHaveAttribute(
      'is-disabled',
      'true',
    );
    expect(deleteServiceAccountSpy).not.toHaveBeenCalled();
  });
});
