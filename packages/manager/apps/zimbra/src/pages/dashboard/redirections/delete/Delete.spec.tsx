import React from 'react';

import { describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test.provider';

import DeleteRedirectionModal from './Delete.modal';

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
});
