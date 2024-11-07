import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import ModalDeleteAutoReply from '../ModalDeleteAutoReply.component';
import { render, screen } from '@/utils/test.provider';

describe('ModalDeleteAutoReply Component', () => {
  it('should have button disabled if no deleteAutoReplyId', () => {
    render(<ModalDeleteAutoReply />);
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancel-btn');
    const deleteButton = screen.getByTestId('delete-btn');

    expect(cancelButton).toBeEnabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should have button enabled if deleteAutoReplyId', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        deleteAutoReplyId: 'someid',
      }),
      vi.fn(),
    ]);

    render(<ModalDeleteAutoReply />);
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancel-btn');
    const deleteButton = screen.getByTestId('delete-btn');

    expect(cancelButton).toBeEnabled();
    expect(deleteButton).toBeEnabled();
  });
});
