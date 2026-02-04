import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ServiceList from './serviceList';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/common/components/DomainsList/domainsList', () => ({
  default: vi.fn(() => <div data-testid="domains-list">DomainsList</div>),
}));

vi.mock('@/common/components/DomainsList/guideButton', () => ({
  default: vi.fn(() => <button data-testid="guide-button">Guide</button>),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  ChangelogButton: vi.fn(({ links }) => (
    <button data-testid="changelog-button">Changelog</button>
  )),
}));

vi.mock('@ovh-ux/muk', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/muk')>();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      notifications: [],
    })),
    Notifications: vi.fn(() => (
      <div data-testid="notifications">Notifications</div>
    )),
  };
});

describe('ServiceList', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = renderWithRouter(<ServiceList />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    renderWithRouter(<ServiceList />);
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('should render the DomainsList component', () => {
    renderWithRouter(<ServiceList />);
    expect(screen.getByTestId('domains-list')).toBeInTheDocument();
  });

  it('should render the guide button', () => {
    renderWithRouter(<ServiceList />);
    expect(screen.getByTestId('guide-button')).toBeInTheDocument();
  });

  it('should render the changelog button', () => {
    renderWithRouter(<ServiceList />);
    expect(screen.getByTestId('changelog-button')).toBeInTheDocument();
  });

  it('should not display notifications when notifications array is empty', () => {
    renderWithRouter(<ServiceList />);
    expect(screen.queryByTestId('notifications')).not.toBeInTheDocument();
  });

  it('should display notifications when notifications array is not empty', async () => {
    const { useNotifications } = await import('@ovh-ux/muk');
    vi.mocked(useNotifications).mockReturnValue({
      notifications: [{ id: '1', message: 'Test notification' }] as any,
    });

    renderWithRouter(<ServiceList />);
    expect(screen.getByTestId('notifications')).toBeInTheDocument();
  });
});
