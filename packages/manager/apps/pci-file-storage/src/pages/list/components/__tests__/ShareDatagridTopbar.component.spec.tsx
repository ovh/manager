import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ShareDatagridTopbar } from '../ShareDatagridTopbar.component';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ShareDatagridTopbar', () => {
  it('should render button navigate to create route when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ShareDatagridTopbar />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: 'list:actionButton' });
    expect(button).toBeVisible();

    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('./new');
  });
});
