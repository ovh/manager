import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TagsTile } from '@/components/dashboard/TagsTile.component';

const { mockNavigate, mockGetTenantTagsUrl } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockGetTenantTagsUrl: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/routes/Routes.utils', () => ({
  getTenantTagsUrl: mockGetTenantTagsUrl,
}));

vi.mock('@ovh-ux/muk', () => ({
  Tile: {
    Root: ({ title, children }: { title: string; children: React.ReactNode }) => (
      <section data-testid="tile-root">
        <h2>{title}</h2>
        {children}
      </section>
    ),
    Item: {
      Root: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tile-item-root">{children}</div>
      ),
    },
  },
  TagsList: ({ tags }: { tags?: Record<string, string> }) => (
    <div data-testid="tags-list">
      {tags &&
        Object.entries(tags).map(([key, value]) => (
          <span key={`${key}-${value}`} data-testid={`tag-${key}-${value}`}>
            {key}:{value}
          </span>
        ))}
    </div>
  ),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Link: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" data-testid="tile-link" onClick={onClick}>
      {children}
    </button>
  ),
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('TagsTile.component', () => {
  const baseProps = {
    tenantId: 'tenant-123',
    title: 'tenant 123',
    tags: {
      environment: 'prod',
    },
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantTagsUrl.mockReturnValue('/tenants/tenant-123/tags');
  });

  it('renders the tile header, tags list and manage link', () => {
    render(<TagsTile {...baseProps} />);

    expect(screen.getByText('dashboard.tags_tile.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.tags_tile.manage_tags')).toBeInTheDocument();
    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-environment-prod')).toBeInTheDocument();
  });

  it('navigates to the tags page when clicking the manage tags link', () => {
    const targetUrl = '/tenants/tenant-123/tags';
    mockGetTenantTagsUrl.mockReturnValue(targetUrl);

    render(<TagsTile {...baseProps} />);

    fireEvent.click(screen.getByTestId('tile-link'));

    expect(mockGetTenantTagsUrl).toHaveBeenCalledWith(baseProps.tenantId);
    expect(mockNavigate).toHaveBeenCalledWith(targetUrl);
  });
});
