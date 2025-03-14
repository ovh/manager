import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TUser } from '@/api/data/users';
import { useDeleteUser, useUser } from '@/api/hooks/useUsers';
import { useNotifications } from '@/hooks/useNotifications';
import DeletePage from './Delete.page';
import { useTracking } from '@/hooks/useTracking';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useUsers', () => ({
  useDeleteUser: vi.fn(),
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

describe('DeletePage', () => {
  const mockNavigate = vi.fn();

  const mockAddSuccessMessage = vi.fn();
  const mockAddErrorMessage = vi.fn();
  const mockDeleteUser = vi.fn();

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

    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: () => mockDeleteUser(),
      isPending: false,
    } as ReturnType<typeof useDeleteUser>);

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

    render(<DeletePage />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('shows loading state when delete operation is pending', async () => {
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: () => mockDeleteUser(),
      isPending: true,
    } as ReturnType<typeof useDeleteUser>);

    render(<DeletePage />);

    await (() => {
      expect(screen.getByTestId('pciModal-button_submit')).toBeDisabled();
    });
  });

  it('should navigate back when cancel button is clicked', () => {
    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call deleteUser when confirm button is clicked', () => {
    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    expect(mockDeleteUser).toHaveBeenCalled();
  });

  it('should handles successful API response correctly', async () => {
    vi.mocked(useDeleteUser).mockImplementation(
      ({ onSuccess }) =>
        ({
          deleteUser: () => {
            mockDeleteUser();
            onSuccess();
          },
          isPending: false,
        } as ReturnType<typeof useDeleteUser>),
    );

    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddSuccessMessage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should handles error API response correctly', async () => {
    vi.mocked(useDeleteUser).mockImplementation(
      ({ onError }) =>
        ({
          deleteUser: () => {
            mockDeleteUser();
            onError(new Error('API Error') as ApiError);
          },
          isPending: false,
        } as ReturnType<typeof useDeleteUser>),
    );

    render(<DeletePage />);

    fireEvent.click(screen.getByTestId('pciModal-button_submit'));

    await waitFor(() => {
      expect(mockAddErrorMessage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });
});
