import { QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import queryClient from '@/queryClient';
import GenerateOpenStackTokenModal from './GenerateOpenStackTokenModal';

import * as _useUserHook from '@/hooks/useUser';
import { GenerateOpenStackTokenReturnType, User } from '@/interface';

function renderModal() {
  const props = {
    projectId: 'e42b4f068f444ea3832435304a316330',
    userId: '337062',
    onClose: vi.fn(),
    onError: vi.fn(),
  };

  render(
    <QueryClientProvider client={queryClient}>
      <GenerateOpenStackTokenModal {...props} />
    </QueryClientProvider>,
  );
}

describe('GenerateOpenStackTokenModal tests.', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display Confirmation Button when the token is undefined', () => {
    renderModal();

    const confirmButton = screen.getByTestId('submitButton');
    expect(confirmButton).toBeVisible();
  });

  it('should disable Confirmation Button when the password field is empty', () => {
    renderModal();

    const submitButton = screen.getByTestId('submitButton');
    expect(submitButton).toHaveAttribute('disabled');
  });

  it('should call useGenerateOpenStackToken generate function when the confirmation Button is clicked', () => {
    const mockGenerate = vi.fn();
    vi.spyOn(_useUserHook, 'useGenerateOpenStackToken').mockReturnValue(({
      isPending: false,
      generate: mockGenerate,
    } as unknown) as GenerateOpenStackTokenReturnType);

    renderModal();

    const confirmButton = screen.getByTestId('submitButton');
    act(() => {
      fireEvent.click(confirmButton);
    });

    expect(mockGenerate).toHaveBeenCalled();
  });

  it('should display the spinner when the token generation is pending', () => {
    vi.spyOn(_useUserHook, 'useGenerateOpenStackToken').mockReturnValue({
      isPending: true,
    } as GenerateOpenStackTokenReturnType);

    renderModal();

    const confirmButton = screen.queryByTestId('open-stack-modal_spinner');
    expect(confirmButton).toBeVisible();
  });

  it('should display the spinner when the fetch of user is pending', () => {
    vi.spyOn(_useUserHook, 'useUser').mockReturnValue({
      isPending: true,
    } as UseQueryResult<User, Error>);

    renderModal();

    const confirmButton = screen.queryByTestId('open-stack-modal_spinner');
    expect(confirmButton).toBeVisible();
  });
});
