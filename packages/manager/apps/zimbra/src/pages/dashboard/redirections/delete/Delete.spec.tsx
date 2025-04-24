import React from 'react';
import { describe, expect, it } from 'vitest';
import DeleteRedirectionModal from './Delete.modal';
import { render, fireEvent, screen } from '@/utils/test.provider';

describe('DeleteRedirection modal', () => {
  it('should render correctly', () => {
    render(<DeleteRedirectionModal />);
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancel-btn');
    const deleteButton = screen.getByTestId('delete-btn');

    expect(cancelButton).not.toBeDisabled();
    expect(deleteButton).not.toBeDisabled();
  });

  it('should trigger the correct action on cancel', () => {
    render(<DeleteRedirectionModal />);
    const cancelButton = screen.getByTestId('cancel-btn');
    fireEvent.click(cancelButton);
  });

  it('should trigger the correct action on delete', () => {
    render(<DeleteRedirectionModal />);
    const deleteButton = screen.getByTestId('delete-btn');
    fireEvent.click(deleteButton);
  });
});
