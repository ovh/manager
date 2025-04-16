import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import DeleteAutoReplyModal from './Delete.modal';
import { render } from '@/utils/test.provider';
import { platformMock } from '@/data/api';

vi.mocked(useParams).mockReturnValue({
  platformId: platformMock[0].id,
  autoReplyId: '0',
});

describe('DeleteAutoReply modal', () => {
  it('should render with delete button enabled', async () => {
    const { getByTestId } = render(<DeleteAutoReplyModal />);

    const cancelButton = getByTestId('cancel-btn');
    const deleteButton = getByTestId('delete-btn');

    expect(cancelButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // TODO: test this when autoreplies are implemented
    /* await act(() => {
      fireEvent.click(btn);
    });

    expect(deleteZimbraPlatformAutoreply).toHaveBeenCalledOnce(); */
  });
});
