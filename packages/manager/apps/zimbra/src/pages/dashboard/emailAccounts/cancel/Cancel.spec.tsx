import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { accountMock, platformMock, slotMock } from '@/data/api';
import { render, waitFor } from '@/utils/test.provider';

import CancelSlotModal from './Cancel.modal';

describe('Slot cancel modal', () => {
  it('check if it is displayed', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      accountId: undefined,
      slotId: slotMock.id,
    });
    const { queryByTestId, getByTestId } = render(<CancelSlotModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const content = getByTestId('text-slot-cancel-content');
    expect(content).toBeInTheDocument();

    const renewDate = getByTestId('text-slot-cancel-renew-date');
    expect(renewDate).toBeInTheDocument();

    const confirm = getByTestId('text-slot-cancel-confirm');
    expect(confirm).toBeInTheDocument();
  });

  it('display account cancellation text', async () => {
    vi.mocked(useParams).mockReturnValue({
      accountId: accountMock.id,
      platformId: platformMock[0].id,
      slotId: slotMock.id,
    });

    const { queryByTestId, getByTestId } = render(<CancelSlotModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const content = getByTestId('text-slot-cancel-content');
    expect(content).toBeInTheDocument();
  });
});
