import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ExpiredSessionModal } from './ExpiredSessionModal';

const onCloseMock = vi.fn();

describe('ExpiredSessionModal', () => {
  it('should render the modal with the correct content', () => {
    render(<ExpiredSessionModal onClose={onCloseMock} />);

    expect(screen.getByText('account-disable-2fa-session-modal-expired-title')).toBeInTheDocument();

    expect(
      screen.getByText('account-disable-2fa-session-modal-expired-message'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('account-disable-2fa-session-modal-expired-auth-button'),
    ).toBeInTheDocument();
  });

  it('should call onClose when the button is clicked', () => {
    render(<ExpiredSessionModal onClose={onCloseMock} />);

    const button = screen.getByText('account-disable-2fa-session-modal-expired-auth-button');
    fireEvent.click(button);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
