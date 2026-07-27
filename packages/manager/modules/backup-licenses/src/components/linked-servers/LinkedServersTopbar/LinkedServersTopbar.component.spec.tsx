import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import LinkedServersTopbar from './LinkedServersTopbar.component';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

describe('LinkedServersTopbar', () => {
  it('navigates to the order funnel when clicking the add CTA', async () => {
    await renderWithProviders(<LinkedServersTopbar isLoading={false} onRefresh={vi.fn()} />);

    await userEvent.click(screen.getByTestId('add-backup-server'));

    expect(navigateMock).toHaveBeenCalledWith('/order');
  });

  it('refreshes the list when clicking the refresh button', async () => {
    const onRefresh = vi.fn();
    await renderWithProviders(<LinkedServersTopbar isLoading={false} onRefresh={onRefresh} />);

    await userEvent.click(screen.getByTestId('refresh-backup-servers'));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
