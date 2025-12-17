import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { GeneralInformationTile } from '@/components/dashboard/GeneralInformationTile.component';
import { getEditTenantUrl } from '@/routes/Routes.utils';

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

const { mockFormatDate } = vi.hoisted(() => ({
  mockFormatDate: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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
  Clipboard: ({ value }: { value?: string }) => <div data-testid="clipboard">{value}</div>,
  useFormatDate: () => mockFormatDate,
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Skeleton: () => <div data-testid="skeleton">loading</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span data-testid="text">{children}</span>,
  TEXT_PRESET: {
    span: 'span',
    paragraph: 'paragraph',
  },
  Link: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" data-testid="edit-link" onClick={onClick}>
      {children}
    </button>
  ),
  Badge: ({ children, color }: { children: React.ReactNode; color: string }) => (
    <span data-testid="badge" data-color={color}>
      {children}
    </span>
  ),
  BADGE_COLOR: {
    success: 'success',
    critical: 'critical',
    warning: 'warning',
    neutral: 'neutral',
  },
}));

describe('GeneralInformationTile.component', () => {
  const baseProps = {
    tenantId: 'tenant-id',
    title: 'tenant-name',
    description: 'tenant description',
    iam: {
      id: 'iam-id',
      urn: 'iam-urn',
    },
    endpoint: 'https://api.endpoint',
    createdAt: '2023-05-05T10:00:00Z',
    updatedAt: '2023-06-05T10:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormatDate.mockImplementation(({ date }: { date: string }) => `formatted-${date}`);
    mockNavigate.mockReset();
  });

  it('renders skeletons when loading', () => {
    render(<GeneralInformationTile {...baseProps} isLoading />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(8);
  });

  it('renders tenant information when data is available', () => {
    render(<GeneralInformationTile {...baseProps} isLoading={false} />);

    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
    expect(screen.getAllByTestId('clipboard')).toHaveLength(3);
    expect(mockFormatDate).toHaveBeenNthCalledWith(1, { date: baseProps.createdAt, format: 'P' });
    expect(mockFormatDate).toHaveBeenNthCalledWith(2, { date: baseProps.updatedAt, format: 'P' });
    expect(screen.getByText(`formatted-${baseProps.createdAt}`)).toBeInTheDocument();
    expect(screen.getByText(`formatted-${baseProps.updatedAt}`)).toBeInTheDocument();
  });

  it('navigates to edit tenant page when link is clicked', () => {
    render(<GeneralInformationTile {...baseProps} isLoading={false} />);

    fireEvent.click(screen.getByTestId('edit-link'));

    expect(mockNavigate).toHaveBeenCalledWith(getEditTenantUrl(baseProps.tenantId));
  });
});
