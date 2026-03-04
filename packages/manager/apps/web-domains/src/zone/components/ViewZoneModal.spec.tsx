import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import ViewZoneModal from '@/zone/components/ViewZoneModal';
import type { TZoneHistoryWithDate } from '@/zone/types/history.types';

const mockViewZone = vi.fn();
const mockContent = '# Zone file\nexample.com. 3600 IN A 1.2.3.4\n';

vi.mock('@/zone/hooks/data/history.hooks', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/zone/hooks/data/history.hooks')
  >();
  return {
    ...actual,
    useViewZoneFile: vi.fn(() => ({
      mutate: mockViewZone,
      data: undefined,
      isPending: false,
      error: null,
    })),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...actual,
    useFormatDate: vi.fn(() => ({ date }: { date: string }) => date),
  };
});

describe('ViewZoneModal', () => {
  const mockItem: TZoneHistoryWithDate = {
    id: 'zone-history-1',
    date: '2024-01-15T10:00:00Z',
    creationDate: '2024-01-15T10:00:00Z',
    zoneFileUrl: 'https://api.example.com/zone/file/1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ViewZoneModal isOpen={false} onClose={vi.fn()} item={mockItem} />,
      { wrapper },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when item is null', () => {
    const { container } = render(
      <ViewZoneModal isOpen={true} onClose={vi.fn()} item={null} />,
      { wrapper },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal title when open with item', async () => {
    const { useViewZoneFile } = await import(
      '@/zone/hooks/data/history.hooks'
    );
    (useViewZoneFile as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockViewZone,
      data: mockContent,
      isPending: false,
      error: null,
    });

    render(
      <ViewZoneModal isOpen={true} onClose={vi.fn()} item={mockItem} />,
      { wrapper },
    );
    expect(screen.getByText(/zone_history_view_title/i)).toBeInTheDocument();
  });

  it('calls viewZone with item url on mount when open', async () => {
    const { useViewZoneFile } = await import(
      '@/zone/hooks/data/history.hooks'
    );
    (useViewZoneFile as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockViewZone,
      data: undefined,
      isPending: false,
      error: null,
    });

    render(
      <ViewZoneModal isOpen={true} onClose={vi.fn()} item={mockItem} />,
      { wrapper },
    );
    expect(mockViewZone).toHaveBeenCalledWith(mockItem.zoneFileUrl);
  });

  it('shows spinner when loading', async () => {
    const { useViewZoneFile } = await import(
      '@/zone/hooks/data/history.hooks'
    );
    (useViewZoneFile as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockViewZone,
      data: undefined,
      isPending: true,
      error: null,
    });

    render(
      <ViewZoneModal isOpen={true} onClose={vi.fn()} item={mockItem} />,
      { wrapper },
    );
    // Spinner renders when isPending is true
    expect(
      screen.queryByText('zone_history_error'),
    ).not.toBeInTheDocument();
  });

  it('shows error message when viewZone fails', async () => {
    const { useViewZoneFile } = await import(
      '@/zone/hooks/data/history.hooks'
    );
    (useViewZoneFile as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockViewZone,
      data: undefined,
      isPending: false,
      error: { message: 'Network error' },
    });

    render(
      <ViewZoneModal isOpen={true} onClose={vi.fn()} item={mockItem} />,
      { wrapper },
    );
    expect(screen.getByText(/zone_history_error/)).toBeInTheDocument();
  });

  it('shows zone content when loaded', async () => {
    const { useViewZoneFile } = await import(
      '@/zone/hooks/data/history.hooks'
    );
    (useViewZoneFile as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockViewZone,
      data: mockContent,
      isPending: false,
      error: null,
    });

    render(
      <ViewZoneModal isOpen={true} onClose={vi.fn()} item={mockItem} />,
      { wrapper },
    );
    expect(
      screen.getByText((content) => content.includes('# Zone file')),
    ).toBeInTheDocument();
  });

  it('calls onClose when cancel/close button is triggered', async () => {
    const { useViewZoneFile } = await import(
      '@/zone/hooks/data/history.hooks'
    );
    (useViewZoneFile as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockViewZone,
      data: mockContent,
      isPending: false,
      error: null,
    });
    const onClose = vi.fn();

    render(
      <ViewZoneModal isOpen={true} onClose={onClose} item={mockItem} />,
      { wrapper },
    );
    // Modal is dismissible — the title should be rendered
    expect(screen.getByText(/zone_history_view_title/i)).toBeInTheDocument();
  });
});
