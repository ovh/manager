import React from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useShares } from '@/data/hooks/shares/useShares';

import { ShareDatagridTopbar } from '../ShareDatagridTopbar.component';

const mockNavigate = vi.fn();
const { mockRefetch } = vi.hoisted(() => ({
  mockRefetch: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/data/hooks/shares/useShares', () => ({
  useShares: vi.fn().mockReturnValue({
    refetch: mockRefetch,
    isFetching: false,
  }),
}));

describe('ShareDatagridTopbar', () => {
  it('should render button navigate to create route when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareDatagridTopbar />);

    const button = screen.getByRole('button', { name: 'list:actionButton' });
    expect(button).toBeVisible();

    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('./new');
  });

  it('should call refetch when refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareDatagridTopbar />);

    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons[1];
    expect(refreshButton).toBeDefined();
    await user.click(refreshButton as HTMLElement);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should disable refresh button and show spinner when isFetching', () => {
    vi.mocked(useShares).mockReturnValueOnce({
      refetch: mockRefetch,
      isFetching: true,
    } as unknown as QueryObserverSuccessResult<unknown>);
    render(<ShareDatagridTopbar />);

    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons[1];
    expect(refreshButton).toBeDefined();
    expect(refreshButton).toBeDisabled();
  });
});
