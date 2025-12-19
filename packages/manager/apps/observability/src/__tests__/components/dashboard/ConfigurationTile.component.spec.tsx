import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ConfigurationTile } from '@/components/dashboard/ConfigurationTile.component';

const { mockFormatObservabilityDuration } = vi.hoisted(() => ({
  mockFormatObservabilityDuration: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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
      Term: ({ label }: { label: string }) => <dt data-testid="tile-item-term">{label}</dt>,
      Description: ({ children }: { children: React.ReactNode }) => (
        <dd data-testid="tile-item-description">{children}</dd>
      ),
    },
  },
  useDateFnsLocale: () => 'test-locale',
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Skeleton: () => <div data-testid="skeleton">loading</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span data-testid="text">{children}</span>,
  TEXT_PRESET: {
    span: 'span',
  },
}));

vi.mock('@/utils/duration.utils', () => ({
  formatObservabilityDuration: mockFormatObservabilityDuration,
}));

describe('ConfigurationTile.component', () => {
  const baseProps = {
    retention: 'P10D',
    numberOfSeriesCurrent: 1200,
    numberOfSeriesMaximum: 5000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormatObservabilityDuration.mockReturnValue('10 days');
  });

  it('renders skeletons while data is loading', () => {
    render(<ConfigurationTile {...baseProps} isLoading />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(2);
  });

  it('renders formatted retention and metric limits when available', () => {
    render(<ConfigurationTile {...baseProps} isLoading={false} />);

    expect(mockFormatObservabilityDuration).toHaveBeenCalledWith(
      baseProps.retention,
      'test-locale',
    );
    expect(screen.getByText('10 days')).toBeInTheDocument();
    expect(screen.getByText(String(baseProps.numberOfSeriesMaximum))).toBeInTheDocument();
  });

  it('skips duration formatting when retention is undefined', () => {
    render(
      <ConfigurationTile
        retention={undefined}
        numberOfSeriesMaximum={baseProps.numberOfSeriesMaximum}
        isLoading={false}
      />,
    );

    expect(mockFormatObservabilityDuration).not.toHaveBeenCalled();
  });
});
