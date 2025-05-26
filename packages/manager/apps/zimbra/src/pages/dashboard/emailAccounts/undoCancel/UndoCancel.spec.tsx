import React from 'react';
import { useParams } from 'react-router-dom';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { describe, expect, vi } from 'vitest';
import { render, waitFor } from '@/utils/test.provider';
import UndoCancelSlotModal from './UndoCancel.modal';
import { accountMock, slotMock } from '@/data/api';

describe('Slot undo cancel modal', () => {
  it('check if it is displayed', async () => {
    vi.mocked(useParams).mockReturnValue({
      accountId: accountMock.id,
      slotId: slotMock.id,
    });
    const { queryByTestId, getByTestId } = render(<UndoCancelSlotModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const content = getByTestId('text-slot-undo-cancel-content');
    expect(content).toBeInTheDocument();

    const renewDate = getByTestId('text-slot-undo-cancel-renew-date');
    expect(renewDate).toBeInTheDocument();

    const confirm = getByTestId('text-slot-undo-cancel-confirm');
    expect(confirm).toBeInTheDocument();
  });
});
