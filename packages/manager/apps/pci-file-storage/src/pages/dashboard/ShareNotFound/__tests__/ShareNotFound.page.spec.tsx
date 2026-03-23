import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ShareNotFound from '../ShareNotFound.page';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ shareId: 'share-123' }),
  };
});

const createAxios404 = (queryId?: string): AxiosError => {
  const headers = new AxiosHeaders();
  if (queryId) {
    headers.set('x-ovh-queryid', queryId);
  }
  return new AxiosError('Not Found', '404', undefined, undefined, {
    status: 404,
    statusText: 'Not Found',
    headers,
    config: { headers: new AxiosHeaders() },
    data: {},
  });
};

describe('ShareNotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the not found description with the share id', () => {
    render(<ShareNotFound error={createAxios404()} />);

    expect(
      screen.getByText('dashboard:not_found.description{"shareId":"share-123"}'),
    ).toBeVisible();
  });

  it('should display the query id when present in error headers', () => {
    render(<ShareNotFound error={createAxios404('FR.ws-8.abc123')} />);

    expect(screen.getByText('Error code: FR.ws-8.abc123')).toBeVisible();
  });

  it('should not display the query id when absent from error headers', () => {
    render(<ShareNotFound error={createAxios404()} />);

    expect(screen.queryByText(/Error code/)).not.toBeInTheDocument();
  });

  it('should navigate back when go back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareNotFound error={createAxios404()} />);

    await user.click(screen.getByText('dashboard:not_found.go_back'));

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should reload when reload button is clicked', async () => {
    const user = userEvent.setup();
    render(<ShareNotFound error={createAxios404()} />);

    await user.click(screen.getByText('dashboard:not_found.reload'));

    expect(mockNavigate).toHaveBeenCalledWith(0);
  });
});
