import { render } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotifications } from '@/hooks/useNotifications';
import { usePaginatedUsers } from '@/api/hooks/useUsers';
import { TUser } from '@/api/data/users';
import ListingPage from './Listing.page';

vi.mock('@/pages/users/Actions.tsx');

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useUsers', () => ({
  usePaginatedUsers: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  }),
}));

describe('ListingPage', () => {
  const mockNavigate = vi.fn();

  const mockAddSuccessMessage = vi.fn();
  const mockAddErrorMessage = vi.fn();

  const mockPaginatedUsers = {
    rows: [
      {
        id: 1,
        creationDate: '2023-01-01',
      },
      {
        id: 2,
        creationDate: '2023-01-01',
      },
    ] as TUser[],
    totalRows: 2,
    pageCount: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    });
  });

  it('should match snapshot when is loading false', async () => {
    vi.mocked(usePaginatedUsers).mockReturnValue(({
      paginatedUsers: mockPaginatedUsers,
      isPending: false,
    } as unknown) as any);

    const { container } = render(<ListingPage />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when is loading true', async () => {
    vi.mocked(usePaginatedUsers).mockReturnValue(({
      paginatedUsers: mockPaginatedUsers,
      isPending: true,
    } as unknown) as any);

    const { container } = render(<ListingPage />);
  });
});
