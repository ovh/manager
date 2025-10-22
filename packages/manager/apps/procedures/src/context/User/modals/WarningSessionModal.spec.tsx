import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { WarningSessionModal } from './WarningSessionModal';

const onCloseMock = vi.fn();

describe('WarningSessionModal', () => {
  it('should render the modal with the correct content', () => {
    render(<WarningSessionModal onClose={onCloseMock} />);

    expect(
      screen.getByText('account-disable-2fa-session-modal-warning-message'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('account-disable-2fa-session-modal-warning-ok-button'),
    ).toBeInTheDocument();
  });

  it('should call onClose when the button is clicked', () => {
    render(<WarningSessionModal onClose={onCloseMock} />);

    const button = screen.getByText('account-disable-2fa-session-modal-warning-ok-button');
    fireEvent.click(button);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
