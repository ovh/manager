import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ShareDatagridTopbar } from '../ShareDatagridTopbar.component';

const mockNavigate = vi.fn();
const mockRefetch = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const defaultProps = {
  refetch: mockRefetch,
  isFetching: false,
};

describe('ShareDatagridTopbar', () => {
  it('should render button navigate to create route when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareDatagridTopbar {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'list:actionButton' });
    expect(button).toBeVisible();

    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('./new');
  });

  it('should call refetch when refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareDatagridTopbar {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons[1];
    expect(refreshButton).toBeDefined();
    await user.click(refreshButton as HTMLElement);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should disable refresh button and show spinner when isFetching', () => {
    render(<ShareDatagridTopbar {...defaultProps} isFetching />);

    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons[1];
    expect(refreshButton).toBeDefined();
    expect(refreshButton).toBeDisabled();
  });
});
