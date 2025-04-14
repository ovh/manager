import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import ModalDeleteAutoReply from '../ModalDeleteAutoReply.component';
import { render } from '@/utils/test.provider';
import { platformMock } from '@/api/_mock_';

vi.mocked(useParams).mockReturnValue({
  platformId: platformMock[0].id,
  autoReplyId: '0',
});

describe('ModalDeleteAutoReply Component', () => {
  it('should render with delete button enabled', async () => {
    const { getByTestId } = render(<ModalDeleteAutoReply />);

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
