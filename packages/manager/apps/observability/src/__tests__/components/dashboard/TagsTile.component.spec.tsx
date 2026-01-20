import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TagsTile } from '@/components/dashboard/TagsTile.component';

const { mockUseHref } = vi.hoisted(() => ({
  mockUseHref: vi.fn((href: string) => href),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useHref: mockUseHref,
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
  Link: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a data-testid="tile-link" href={href}>
      {children}
    </a>
  ),
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('TagsTile.component', () => {
  const baseProps = {
    href: '/tenants/tenant-123/tags',
    title: 'tenant 123',
    tags: {
      environment: 'prod',
    },
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the tile header, tags list and manage link', () => {
    render(<TagsTile {...baseProps} />);

    expect(screen.getByText('dashboard.tags_tile.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.tags_tile.manage_tags')).toBeInTheDocument();
    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-environment-prod')).toBeInTheDocument();
  });

  it('renders the link with the correct href from useHref', () => {
    render(<TagsTile {...baseProps} />);

    const link = screen.getByTestId('tile-link');
    expect(mockUseHref).toHaveBeenCalledWith(baseProps.href);
    expect(link).toHaveAttribute('href', baseProps.href);
  });

  it('hides the manage tags link when hideLink is true', () => {
    render(<TagsTile {...baseProps} hideLink />);

    expect(screen.queryByTestId('tile-link')).not.toBeInTheDocument();
  });
});
