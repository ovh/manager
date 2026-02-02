import React from 'react';

import { useNavigate } from 'react-router-dom';

import { fireEvent, screen } from '@testing-library/dom';
import { describe, expect, it } from 'vitest';

import { render } from '@/utils/test.provider';

import DeleteRedirectionModal from './Delete.modal';

const mockNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockNavigate);

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

  it('navigates back when cancel button is clicked', () => {
    render(<DeleteRedirectionModal />);

    fireEvent.click(screen.getByTestId('cancel-btn'));

    expect(mockNavigate).toHaveBeenCalledWith('..', {
      state: { clearSelectedRedirections: false },
    });
  });
});
