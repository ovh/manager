import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TagsList } from '@/components/dashboard/TagsList.component';

const buildTagsRecord = (count: number) =>
  Array.from({ length: count }).reduce<Record<string, string>>((acc, _, index) => {
    acc[`tag-${index}`] = `value-${index}`;
    return acc;
  }, {});

vi.mock('@ovhcloud/ods-react', () => ({
  Badge: ({ children, color }: { children: React.ReactNode; color: string }) => (
    <span data-testid="badge" data-color={color}>
      {children}
    </span>
  ),
  BADGE_COLOR: {
    neutral: 'neutral',
  },
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" data-testid="toggle-button" onClick={onClick}>
      {children}
    </button>
  ),
  BUTTON_VARIANT: {
    ghost: 'ghost',
  },
  BUTTON_SIZE: {
    xs: 'xs',
  },
  Icon: ({ name }: { name: string }) => <span data-testid="icon" data-name={name} />,
  ICON_NAME: {
    chevronDoubleLeft: 'chevronDoubleLeft',
    chevronDoubleRight: 'chevronDoubleRight',
  },
  Skeleton: () => <div data-testid="skeleton">loading</div>,
}));

describe('TagsList.component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a skeleton while loading', () => {
    render(<TagsList tags={buildTagsRecord(3)} isLoading maxVisibleTags={2} />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
  });

  it('limits visible tags until expanded', () => {
    render(<TagsList tags={buildTagsRecord(4)} isLoading={false} maxVisibleTags={2} />);

    expect(screen.getAllByTestId('badge')).toHaveLength(2);
    expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'chevronDoubleRight');

    fireEvent.click(screen.getByTestId('toggle-button'));

    expect(screen.getAllByTestId('badge')).toHaveLength(4);
    expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'chevronDoubleLeft');
  });

  it('hides the toggle button when not needed', () => {
    render(<TagsList tags={buildTagsRecord(2)} isLoading={false} maxVisibleTags={5} />);

    expect(screen.queryByTestId('toggle-button')).not.toBeInTheDocument();
  });

  it('renders nothing else when there are no tags and not loading', () => {
    render(<TagsList tags={{}} isLoading={false} maxVisibleTags={3} />);

    expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toggle-button')).not.toBeInTheDocument();
  });
});
