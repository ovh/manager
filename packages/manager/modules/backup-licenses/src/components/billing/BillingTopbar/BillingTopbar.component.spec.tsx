import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import BillingTopbar from './BillingTopbar.component';

describe('BillingTopbar', () => {
  it('refreshes on click', async () => {
    const onRefresh = vi.fn();
    await renderWithProviders(<BillingTopbar isLoading={false} onRefresh={onRefresh} />);

    await userEvent.click(screen.getByTestId('refresh-billing'));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
