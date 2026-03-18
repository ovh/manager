import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/common/utils/test.provider';
import '@/common/setupTests';
import ServiceList from './serviceList';

vi.mock('@/common/components/DomainsList/domainsList', () => ({
  default: vi.fn(() => <div data-testid="domains-list">DomainsList</div>),
}));

vi.mock('@/common/components/DomainsList/guideButton', () => ({
  default: vi.fn(() => <button data-testid="guide-button">Guide</button>),
}));

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...actual,
    ErrorBanner: ({ error }: any) => (
      <div data-testid="error-banner">{error?.data?.message}</div>
    ),
    ChangelogButton: () => (
      <div data-testid="changelog-button-inner">Changelog</div>
    ),
  };
});

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
    BaseLayout: ({ children, header, message }: any) => (
      <div data-testid="base-layout">
        {header?.title && <div data-testid="title">{header.title}</div>}
        {header?.changelogButton && (
          <div data-testid="changelog-button">{header.changelogButton}</div>
        )}
        {header?.guideMenu && header.guideMenu}
        {header?.headerButton && header.headerButton}
        {message}
        {children}
      </div>
    ),
    Datagrid: ({ data, isLoading, topbar, rowSelection }: any) => {
      const [selected, setSelected] = (rowSelection
        ? [rowSelection.rowSelection, rowSelection.setRowSelection]
        : [undefined, undefined]) as any;
      if (isLoading) {
        return (
          <div data-testid="datagrid">
            <div data-testid="datagrid-loading">Loading...</div>
            {topbar}
          </div>
        );
      }
      return (
        <div data-testid="datagrid">
          {topbar}
          <div data-testid="datagrid-content">
            {(data ?? []).map((row: any) => (
              <div key={row.id} data-testid={`datagrid-row-${row.id}`}>
                {setSelected && (
                  <input
                    type="checkbox"
                    data-testid={`checkbox-${row.id}`}
                    checked={!!selected?.[row.id]}
                    onChange={() => {
                      const next = { ...selected };
                      if (next[row.id]) {
                        delete next[row.id];
                      } else {
                        next[row.id] = true;
                      }
                      setSelected(next);
                    }}
                  />
                )}
                {row.id}
              </div>
            ))}
          </div>
        </div>
      );
    },
    useNotifications: vi.fn(() => ({
      notifications: [],
    })),
    Notifications: vi.fn(() => (
      <div data-testid="notifications">Notifications</div>
    )),
  };
});

vi.mock('./guideButton', () => ({
  default: () => <div data-testid="domain-guide-button">Guide Button</div>,
}));

vi.mock('@/domain/hooks/useDomainDatagridColumns', () => ({
  useDomainDatagridColumns: vi.fn(() => [
    { id: 'domain', header: 'Domain' },
    { id: 'state', header: 'State' },
  ]),
}));

describe('ServiceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<ServiceList />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<ServiceList />);
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('should render the DomainsList component', () => {
    render(<ServiceList />);
    expect(screen.getByTestId('domains-list')).toBeInTheDocument();
  });

  it('should render the guide button', () => {
    render(<ServiceList />);
    expect(screen.getByTestId('guide-button')).toBeInTheDocument();
  });

  it('should render the changelog button', () => {
    render(<ServiceList />);
    expect(screen.getByTestId('changelog-button')).toBeInTheDocument();
  });

  it('should not display notifications when notifications array is empty', () => {
    render(<ServiceList />);
    expect(screen.queryByTestId('notifications')).not.toBeInTheDocument();
  });

  it('should display notifications when notifications array is not empty', async () => {
    const { useNotifications } = await import('@ovh-ux/muk');
    vi.mocked(useNotifications).mockReturnValue({
      notifications: [{ id: '1', message: 'Test notification' }] as any,
    });

    render(<ServiceList />);
    expect(screen.getByTestId('notifications')).toBeInTheDocument();
  });
});
