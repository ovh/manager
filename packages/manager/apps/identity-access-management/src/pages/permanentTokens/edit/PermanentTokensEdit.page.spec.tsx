import React, { PropsWithChildren } from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReactRouterDom, { useParams } from 'react-router-dom';
import { createWrapper } from '@/test-utils/wrapperRender';

import {
  useGetIamUserToken,
  useCreateIamUserToken,
  useUpdateIamUserToken,
} from '@/data/hooks/useGetIamUserTokens';
import PermanentTokensAdd from './PermanentTokensEdit.page';

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

vi.mock('@/data/hooks/useGetIamUserTokens', () => ({
  useGetIamUserToken: vi.fn(),
  useCreateIamUserToken: vi.fn(),
  useUpdateIamUserToken: vi.fn(),
}));

const wrapper = createWrapper();

describe('PermanentTokensEdit (creation mode)', () => {
  const createTokenSpy = vi.fn();
  const updateTokenSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      userId: 'fakeUserId',
      tokenId: null,
    });
    vi.mocked(useGetIamUserToken).mockReturnValue(({
      isLoading: false,
      data: null,
    } as unknown) as ReturnType<typeof useGetIamUserToken>);
    vi.mocked(useCreateIamUserToken).mockReturnValue(({
      createToken: createTokenSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useCreateIamUserToken>);
    vi.mocked(useUpdateIamUserToken).mockReturnValue(({
      updateToken: updateTokenSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useUpdateIamUserToken>);
  });

  it('displays modal with default value and correct title', () => {
    const { getByText, getByTestId } = render(<PermanentTokensAdd />, {
      wrapper,
    });

    expect(getByText('iam_user_token_modal_title_add')).toBeVisible();
    expect(getByTestId('tokenName')).toHaveAttribute('value', '');
    expect(getByTestId('tokenDescription')).toHaveAttribute('value', '');
  });

  it('calls createToken on submit', () => {
    const { getByTestId } = render(<PermanentTokensAdd />, { wrapper });
    fireEvent.change(getByTestId('tokenName'), {
      target: { value: 'new-token' },
    });
    fireEvent.change(getByTestId('tokenDescription'), {
      target: { value: 'Fake token description' },
    });
    fireEvent.click(getByTestId('primary-button'));

    expect(updateTokenSpy).not.toHaveBeenCalled();
    expect(createTokenSpy).toHaveBeenCalledWith({
      name: 'new-token',
      description: 'Fake token description',
    });
  });

  it('does not submit when pending', () => {
    vi.mocked(useCreateIamUserToken).mockReturnValue(({
      createToken: createTokenSpy,
      isPending: true,
    } as unknown) as ReturnType<typeof useCreateIamUserToken>);
    const { getByTestId } = render(<PermanentTokensAdd />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(getByTestId('primary-button')).toHaveAttribute(
      'is-disabled',
      'true',
    );
    expect(updateTokenSpy).not.toHaveBeenCalled();
    expect(createTokenSpy).not.toHaveBeenCalled();
  });
});

describe('PermanentTokensEdit (edit mode)', () => {
  const createTokenSpy = vi.fn();
  const updateTokenSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      userId: 'fakeUserId',
      tokenId: 'fake-token',
    });
    vi.mocked(useGetIamUserToken).mockReturnValue(({
      data: {
        name: 'fake-token',
        description: 'Fake token description',
        creation: '2025-05-11T00:00:00+02:00',
        lastUsed: '2025-06-11T00:00:00+02:00',
        expiresAt: '2025-06-11T00:00:00+02:00',
      },
    } as unknown) as ReturnType<typeof useGetIamUserToken>);
    vi.mocked(useCreateIamUserToken).mockReturnValue(({
      createToken: createTokenSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useCreateIamUserToken>);
    vi.mocked(useUpdateIamUserToken).mockReturnValue(({
      updateToken: updateTokenSpy,
      isPending: false,
    } as unknown) as ReturnType<typeof useUpdateIamUserToken>);
  });

  it('displays modal with pre-filled value and correct title', () => {
    const { getByText, getByTestId } = render(<PermanentTokensAdd />, {
      wrapper,
    });
    expect(getByText('iam_user_token_modal_title_edit')).toBeVisible();
    expect(getByTestId('tokenName')).toHaveAttribute('value', 'fake-token');
    expect(getByTestId('tokenDescription')).toHaveAttribute(
      'value',
      'Fake token description',
    );
  });

  it('calls updateToken on submit', () => {
    const { getByTestId } = render(<PermanentTokensAdd />, { wrapper });
    fireEvent.change(getByTestId('tokenDescription'), {
      target: { value: 'Updated description' },
    });
    fireEvent.click(getByTestId('primary-button'));

    expect(createTokenSpy).not.toHaveBeenCalled();
    expect(updateTokenSpy).toHaveBeenCalledWith({
      name: 'fake-token',
      description: 'Updated description',
      expiresAt: '2025-06-10T22:00:00.000Z',
    });
  });

  it('does not submit when pending', () => {
    vi.mocked(useUpdateIamUserToken).mockReturnValue(({
      updateToken: updateTokenSpy,
      isPending: true,
    } as unknown) as ReturnType<typeof useUpdateIamUserToken>);
    const { getByTestId } = render(<PermanentTokensAdd />, { wrapper });
    fireEvent.click(getByTestId('primary-button'));

    expect(getByTestId('primary-button')).toHaveAttribute(
      'is-disabled',
      'true',
    );
    expect(updateTokenSpy).not.toHaveBeenCalled();
    expect(createTokenSpy).not.toHaveBeenCalled();
  });
});
