import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import ModalDeleteAutoReply from '../ModalDeleteAutoReply.component';
import { render } from '@/utils/test.provider';

describe('ModalDeleteAutoReply Component', () => {
  it('should have button disabled if no deleteAutoReplyId', () => {
    const { getByTestId } = render(<ModalDeleteAutoReply />);

    const cancelButton = getByTestId('cancel-btn');
    const deleteButton = getByTestId('delete-btn');

    expect(cancelButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('is-disabled', 'true');
  });

  it('should have button enabled if deleteAutoReplyId', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        deleteAutoReplyId: 'someid',
      }),
      vi.fn(),
    ]);

    const { getByTestId } = render(<ModalDeleteAutoReply />);

    const cancelButton = getByTestId('cancel-btn');
    const deleteButton = getByTestId('delete-btn');

    expect(cancelButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('is-disabled', 'false');
  });
});
