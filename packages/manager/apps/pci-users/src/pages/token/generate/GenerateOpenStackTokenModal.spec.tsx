import {
  OdsInputValueChangeEventDetail,
  OsdsPassword,
} from '@ovhcloud/ods-components';
import { QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import queryClient from '@/queryClient';
import GenerateOpenStackTokenModal from './GenerateOpenStackTokenModal';

import * as _useUserHook from '@/api/hooks/useUser';
import { GenerateOpenStackTokenReturnType, User } from '@/interface';

function renderModal() {
  const props = {
    projectId: 'temp_project_id',
    userId: 'temp_user_id',
    onClose: vi.fn(),
    onError: vi.fn(),
  };

  render(
    <QueryClientProvider client={queryClient}>
      <GenerateOpenStackTokenModal {...props} />
    </QueryClientProvider>,
  );
}

vi.mock('@/api/hooks/useUser', () => ({
  useGenerateOpenStackToken: vi.fn(() => ({ data: [], isPending: false })),
  useUser: vi.fn(() => ({ data: [], isPending: false })),
}));

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

  it('should call useGenerateOpenStackToken generate function when the confirmation Button is clicked', async () => {
    const mockGenerate = vi.fn();
    vi.spyOn(_useUserHook, 'useGenerateOpenStackToken').mockReturnValue(({
      isPending: false,
      generate: mockGenerate,
    } as unknown) as GenerateOpenStackTokenReturnType);

    renderModal();

    const confirmButton = screen.getByTestId('submitButton');
    const passwordInput = screen.getByTestId('open-stack-token_password');

    act(() => {
      fireEvent.change(passwordInput, {
        target: { value: 'PASSWORD' },
      });
      ((passwordInput as unknown) as OsdsPassword).odsValueChange.emit({
        value: 'PASSWORD',
      } as OdsInputValueChangeEventDetail);
    });

    act(() => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalled();
    });
  });

  it('should display the spinner when the token generation is pending', () => {
    vi.spyOn(_useUserHook, 'useGenerateOpenStackToken').mockReturnValue({
      isPending: true,
    } as GenerateOpenStackTokenReturnType);

    renderModal();

    const spinner = screen.queryByTestId('open-stack-modal_spinner');
    expect(spinner).toBeVisible();
  });

  it('should display the spinner when the fetch of user is pending', () => {
    vi.spyOn(_useUserHook, 'useUser').mockReturnValue({
      isPending: true,
    } as UseQueryResult<User, Error>);

    renderModal();

    const spinner = screen.queryByTestId('open-stack-modal_spinner');
    expect(spinner).toBeVisible();
  });
});
