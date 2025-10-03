import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { getRedirectLoginUrl } from '@/utils/url-builder';

import userContext, { User } from '../context';
import { useSessionModal } from '../useSessionModal';
import { SessionModals } from './SessionModals';

vi.mock('../useSessionModal', () => ({
  useSessionModal: vi.fn(),
}));

vi.mock('@/utils/url-builder', () => ({
  getRedirectLoginUrl: vi.fn(),
}));

vi.mock('./ExpiredSessionModal', () => ({
  ExpiredSessionModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="expired-session-modal">
      <button onClick={onClose}>Close Expired Modal</button>
    </div>
  ),
}));

vi.mock('./WarningSessionModal', () => ({
  WarningSessionModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="warning-session-modal">
      <button onClick={onClose}>Close Warning Modal</button>
    </div>
  ),
}));

const mockUser: Partial<User> = {
  legalForm: 'administration',
  email: 'test@example.com',
  language: 'en',
  subsidiary: 'FR',
};

describe('SessionModals', () => {
  const mockSetShowExpiredModal = vi.fn();
  const mockSetShowWarningModal = vi.fn();

  beforeEach(() => {
    (useSessionModal as any).mockReturnValue({
      setShowExpiredModal: mockSetShowExpiredModal,
      setShowWarningModal: mockSetShowWarningModal,
      showExpiredModal: false,
      showWarningModal: false,
    });

    (getRedirectLoginUrl as any).mockReturnValue('https://login.url');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not display any modals by default', () => {
    render(
      <userContext.Provider value={{ user: mockUser as User }}>
        <SessionModals />
      </userContext.Provider>,
    );

    expect(screen.queryByTestId('expired-session-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('warning-session-modal')).not.toBeInTheDocument();
  });

  it('should display the ExpiredSessionModal when showExpiredModal is true', () => {
    (useSessionModal as any).mockReturnValue({
      setShowExpiredModal: mockSetShowExpiredModal,
      setShowWarningModal: mockSetShowWarningModal,
      showExpiredModal: true,
      showWarningModal: false,
    });

    render(
      <userContext.Provider value={{ user: mockUser as User }}>
        <SessionModals />
      </userContext.Provider>,
    );

    expect(screen.getByTestId('expired-session-modal')).toBeInTheDocument();
  });

  it('should close the ExpiredSessionModal and redirect when the close button is clicked', async () => {
    (useSessionModal as any).mockReturnValue({
      setShowExpiredModal: mockSetShowExpiredModal,
      setShowWarningModal: mockSetShowWarningModal,
      showExpiredModal: true,
      showWarningModal: false,
    });

    render(
      <userContext.Provider value={{ user: mockUser as User }}>
        <SessionModals />
      </userContext.Provider>,
    );

    const closeButton = screen.getByText('Close Expired Modal');
    fireEvent.click(closeButton);

    await vi.waitFor(() => {
      expect(mockSetShowExpiredModal).toHaveBeenCalledWith(false);
      expect(getRedirectLoginUrl).toHaveBeenCalledWith(mockUser);
    });
  });

  it('should display the WarningSessionModal when showWarningModal is true', () => {
    (useSessionModal as any).mockReturnValue({
      setShowExpiredModal: mockSetShowExpiredModal,
      setShowWarningModal: mockSetShowWarningModal,
      showExpiredModal: false,
      showWarningModal: true,
    });

    render(
      <userContext.Provider value={{ user: mockUser as User }}>
        <SessionModals />
      </userContext.Provider>,
    );

    expect(screen.getByTestId('warning-session-modal')).toBeInTheDocument();
  });

  it('should close the WarningSessionModal when the close button is clicked', () => {
    (useSessionModal as any).mockReturnValue({
      setShowExpiredModal: mockSetShowExpiredModal,
      setShowWarningModal: mockSetShowWarningModal,
      showExpiredModal: false,
      showWarningModal: true,
    });

    render(
      <userContext.Provider value={{ user: mockUser as User }}>
        <SessionModals />
      </userContext.Provider>,
    );

    const closeButton = screen.getByText('Close Warning Modal');
    fireEvent.click(closeButton);

    expect(mockSetShowWarningModal).toHaveBeenCalledWith(false);
  });
});
