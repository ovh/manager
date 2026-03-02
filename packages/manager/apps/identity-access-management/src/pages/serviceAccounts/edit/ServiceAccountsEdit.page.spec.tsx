import React, { PropsWithChildren } from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReactRouterDom, { useParams } from 'react-router-dom';
import { createWrapper } from '@/test-utils/wrapperRender';

import {
  useGetIamServiceAccount,
  useCreateIamServiceAccount,
  useUpdateIamServiceAccount
} from '@/data/hooks/useGetIamServiceAccounts';
import ServiceAccountsEdit from './ServiceAccountsEdit.page';

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual: typeof import('@ovhcloud/ods-components/react') = await importOriginal();
  return {
    ...actual,
    OdsFormField: ({ children, ...props }: PropsWithChildren) => (
      <div data-testid="ods-form-field" {...props}>
        {children}
      </div>
    ),
    OdsInput: ({
      value,
      onOdsChange,
      ...props
    }: PropsWithChildren<{
      value: string;
      onOdsChange: (value: unknown) => unknown;
    }>) => (
      <input
        data-testid="ods-input"
        value={value}
        onChange={(e) => onOdsChange({ detail: { value: e.target.value } })}
        {...props}
      />
    ),
    OdsTextarea: ({
      value,
      onOdsChange,
      ...props
    }: PropsWithChildren<{
      value: string;
      onOdsChange: (value: unknown) => unknown;
    }>) => (
      <input
        data-testid="ods-textarea"
        value={value}
        onChange={(e) => onOdsChange({ detail: { value: e.target.value } })}
        {...props}
      />
    ),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof ReactRouterDom = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('@/data/hooks/useGetIamServiceAccounts', () => ({
  useGetIamServiceAccount: vi.fn(),
  useCreateIamServiceAccount: vi.fn(),
  useUpdateIamServiceAccount: vi.fn(),
}));

const wrapper = createWrapper();

describe('ServiceAccountsEdit (creation mode)', () => {
  const createAccountSpy = vi.fn();
  const updateAccountSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      clientId: null,
    });
    vi.mocked(useGetIamServiceAccount).mockReturnValue(({
      isLoading: false,
      data: null,
    } as unknown) as ReturnType<typeof useGetIamServiceAccount>);
    vi.mocked(useCreateIamServiceAccount).mockReturnValue(({
      createServiceAccount: createAccountSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useCreateIamServiceAccount>);
    vi.mocked(useUpdateIamServiceAccount).mockReturnValue(({
      updateServiceAccount: updateAccountSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useUpdateIamServiceAccount>);
  });

  it('displays modal with default value and correct title', () => {
    const { getByText, getByTestId } = render(<ServiceAccountsEdit />, {
      wrapper,
    });

    expect(getByText('iam_service_accounts_add_account')).toBeVisible();
    expect(getByTestId('accountName')).toHaveAttribute('value', '');
    expect(getByTestId('accountDescription')).toHaveAttribute('value', '');
  });

  it('calls createAccount on submit', () => {
    const { getByTestId } = render(<ServiceAccountsEdit />, { wrapper });
    fireEvent.change(getByTestId('accountName'), {
      target: { value: 'new-account' },
    });
    fireEvent.change(getByTestId('accountDescription'), {
      target: { value: 'Fake account description' },
    });
    fireEvent.click(getByTestId('primary-button'));

    expect(updateAccountSpy).not.toHaveBeenCalled();
    expect(createAccountSpy).toHaveBeenCalledWith({
      name: 'new-account',
      description: 'Fake account description',
      flow: 'CLIENT_CREDENTIALS',
      callbackUrls: [],
    });
  });

  it('does not submit when pending', () => {
    vi.mocked(useCreateIamServiceAccount).mockReturnValue(({
      createServiceAccount: createAccountSpy,
      isPending: true,
    } as unknown) as ReturnType<typeof useCreateIamServiceAccount>);
    const { getByTestId } = render(<ServiceAccountsEdit />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(getByTestId('primary-button')).toHaveAttribute(
      'is-disabled',
      'true',
    );
    expect(updateAccountSpy).not.toHaveBeenCalled();
    expect(createAccountSpy).not.toHaveBeenCalled();
  });
});

describe('ServiceAccountsEdit (edit mode)', () => {
  const createAccountSpy = vi.fn();
  const updateAccountSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      clientId: 'fake-account',
    });
    vi.mocked(useGetIamServiceAccount).mockReturnValue(({
      data: {
        clientId: 'fake-account',
        name: 'fake-account',
        description: 'Fake account description',
        callbackUrls: [],
        flow: 'CLIENT_CREDENTIALS',
        identity: null,
        createdAt: '2025-05-11T00:00:00+02:00',
      },
    } as unknown) as ReturnType<typeof useGetIamServiceAccount>);
    vi.mocked(useCreateIamServiceAccount).mockReturnValue(({
      createServiceAccount: createAccountSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useCreateIamServiceAccount>);
    vi.mocked(useUpdateIamServiceAccount).mockReturnValue(({
      updateServiceAccount: updateAccountSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useUpdateIamServiceAccount>);
  });

  it('displays modal with pre-filled value and correct title', () => {
    const { getByText, getByTestId } = render(<ServiceAccountsEdit />, {
      wrapper,
    });
    expect(getByText('iam_service_accounts_edit_account')).toBeVisible();
    expect(getByTestId('accountName')).toHaveAttribute('value', 'fake-account');
    expect(getByTestId('accountDescription')).toHaveAttribute(
      'value',
      'Fake account description',
    );
  });

  it('calls updateAccount on submit', () => {
    const { getByTestId } = render(<ServiceAccountsEdit />, { wrapper });
    fireEvent.change(getByTestId('accountDescription'), {
      target: { value: 'Updated description' },
    });
    fireEvent.click(getByTestId('primary-button'));

    expect(createAccountSpy).not.toHaveBeenCalled();
    expect(updateAccountSpy).toHaveBeenCalledWith({
      name: 'fake-account',
      description: 'Updated description',
      callbackUrls: [],
    });
  });

  it('does not submit when pending', () => {
    vi.mocked(useUpdateIamServiceAccount).mockReturnValue(({
      updateServiceAccount: updateAccountSpy,
      isPending: true,
    } as unknown) as ReturnType<typeof useUpdateIamServiceAccount>);
    const { getByTestId } = render(<ServiceAccountsEdit />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(getByTestId('primary-button')).toHaveAttribute(
      'is-disabled',
      'true',
    );
    expect(updateAccountSpy).not.toHaveBeenCalled();
    expect(createAccountSpy).not.toHaveBeenCalled();
  });
});
