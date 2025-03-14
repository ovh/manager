import { ApiError } from '@ovh-ux/manager-core-api';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotifications } from '@/hooks/useNotifications';
import { useUser, useImportPolicy } from '@/api/hooks/useUsers';
import { TUser } from '@/api/data/users';
import ImportPolicy from './ImportPolicy.page';
import { useTracking } from '@/hooks/useTracking';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useUsers', () => ({
  useImportPolicy: vi.fn(),
  useUser: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  }),
}));

describe('ImportPolicy', () => {
  const mockNavigate = vi.fn();

  const mockAddSuccessMessage = vi.fn();
  const mockAddErrorMessage = vi.fn();
  const mockImportPolicy = vi.fn();

  const mockTrackConfirmAction = vi.fn();
  const mockTrackCancelAction = vi.fn();
  const mockTrackSuccessPage = vi.fn();
  const mockTrackErrorPage = vi.fn();
  const mockTrackActionClick = vi.fn();
  const mockTrackNavigationClick = vi.fn();
  const mockTackCopyClipboardClick = vi.fn();

  const mockUser = {
    id: 1,
  } as TUser;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useUser).mockReturnValue({
      data: mockUser,
      isPending: false,
    } as ReturnType<typeof useUser>);

    vi.mocked(useImportPolicy).mockReturnValue({
      importPolicy: mockImportPolicy,
      isPending: false,
    } as ReturnType<typeof useImportPolicy>);

    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    });

    vi.mocked(useTracking).mockReturnValue({
      trackConfirmAction: mockTrackConfirmAction,
      trackCancelAction: mockTrackCancelAction,
      trackSuccessPage: mockTrackSuccessPage,
      trackErrorPage: mockTrackErrorPage,
      trackActionClick: mockTrackActionClick,
      trackNavigationClick: mockTrackNavigationClick,
      trackCopyClipboardClick: mockTackCopyClipboardClick,
    });
  });

  it('shows loading state when user data is loading', async () => {
    vi.mocked(useUser).mockReturnValue({
      data: null,
      isPending: true,
    } as ReturnType<typeof useUser>);

    render(<ImportPolicy />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('shows loading state when delete operation is pending', async () => {
    vi.mocked(useImportPolicy).mockReturnValue({
      importPolicy: mockImportPolicy,
      isPending: true,
    } as ReturnType<typeof useImportPolicy>);

    render(<ImportPolicy />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('should navigate back when cancel button is clicked', () => {
    render(<ImportPolicy />);

    fireEvent.click(screen.getByTestId('pciModal-button_cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call importPolicy when confirm button is clicked', () => {
    render(<ImportPolicy />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    expect(mockImportPolicy).toHaveBeenCalled();
  });

  it('should handles successful API response correctly', async () => {
    vi.mocked(useImportPolicy).mockImplementation(
      ({ onSuccess }) =>
        ({
          importPolicy: () => {
            mockImportPolicy();
            onSuccess();
          },
          isPending: false,
        } as ReturnType<typeof useImportPolicy>),
    );

    render(<ImportPolicy />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddSuccessMessage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should handles error API response correctly', async () => {
    vi.mocked(useImportPolicy).mockImplementation(
      ({ onError }) =>
        ({
          importPolicy: () => {
            mockImportPolicy();
            onError(new Error('API Error') as ApiError);
          },
          isPending: false,
        } as ReturnType<typeof useImportPolicy>),
    );

    render(<ImportPolicy />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddErrorMessage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });
});
