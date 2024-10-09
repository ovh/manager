import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TileError from './TileError.component';

describe('TileError Component', () => {
  it('renders title, message, and button correctly', () => {
    const refetchMock = vi.fn();

    render(<TileError message="Error message details" refetch={refetchMock} />);

    expect(screen.getByText('manager_error_tile_title')).toBeInTheDocument();
    expect(screen.getByText('Error message details')).toBeInTheDocument();
    expect(
      screen.getByText('manager_error_tile_action_reload_label'),
    ).toBeInTheDocument();
  });

  it('calls refetch function when the button is clicked', async () => {
    const refetchMock = vi.fn();

    render(<TileError message="Error message details" refetch={refetchMock} />);

    const button = screen.getByText('manager_error_tile_action_reload_label');
    await act(() => fireEvent.click(button));
    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
