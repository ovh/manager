import { render } from '@testing-library/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TArchiveContainer } from '@/api/data/archive';
import { useArchiveRegion, usePaginatedArchive } from '@/api/hooks/useArchive';
import { useNotifications } from '@/hooks/useNotifications';
import { useTracking } from '@/hooks/useTracking';
import ListingPage from './Listing.page';

vi.mock('@/hooks/useTracking', () => ({
  useTracking: vi.fn(),
}));

vi.mock('@/hooks/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('@/api/hooks/useArchive', () => ({
  usePaginatedArchive: vi.fn(),
  useArchiveRegion: vi.fn(),
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
  const mockTrackConfirmAction = vi.fn();
  const mockTrackCancelAction = vi.fn();
  const mockTrackSuccessPage = vi.fn();
  const mockTrackErrorPage = vi.fn();
  const mockTrackActionClick = vi.fn();
  const mockTrackNavigationClick = vi.fn();
  const mockTrackCopyClipboardClick = vi.fn();

  const mockArchives = [
    {
      name: 'name1',
      status: 'active',
    },
    {
      name: 'name2',
      status: 'active',
    },
  ] as TArchiveContainer[];

  const mockPaginatedArchives = {
    rows: mockArchives,
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

    vi.mocked(useTracking).mockReturnValue({
      trackConfirmAction: mockTrackConfirmAction,
      trackCancelAction: mockTrackCancelAction,
      trackSuccessPage: mockTrackSuccessPage,
      trackErrorPage: mockTrackErrorPage,
      trackActionClick: mockTrackActionClick,
      trackNavigationClick: mockTrackNavigationClick,
      trackCopyClipboardClick: mockTrackCopyClipboardClick,
    });

    vi.mocked(useArchiveRegion).mockReturnValue('BHS');
  });

  it('should match snapshot when is loading false', async () => {
    vi.mocked(usePaginatedArchive).mockReturnValue({
      paginatedArchives: mockPaginatedArchives,
      allArchives: mockArchives,
      isPending: false,
    } as ReturnType<typeof usePaginatedArchive>);

    const { container } = render(<ListingPage />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when is loading true', async () => {
    vi.mocked(usePaginatedArchive).mockReturnValue({
      paginatedArchives: {},
      allArchives: [],
      isPending: true,
    } as ReturnType<typeof usePaginatedArchive>);

    const { container } = render(<ListingPage />);

    expect(container).toMatchSnapshot();
  });
});
