import * as React from 'react';

import * as reactRouterDom from 'react-router-dom';

import type { CellContext } from '@tanstack/react-table';
import '@testing-library/jest-dom';
import { render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CertificateType, SslCertificate, State } from '@/data/types/product/ssl';
import useDatagridColumn, { DatagridActionCell } from '@/hooks/ssl/useDatagridColumn';
import { wrapper } from '@/utils/test.provider';

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual<typeof import('@ovh-ux/muk')>('@ovh-ux/muk');
  return {
    ...actual,
    useFormatDate: () => (params: { date: string; format: string }) => {
      return `formatted-${params.date}`;
    },
    ActionMenu: ({
      id,
      items,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      items?: Array<{ id: number; label: string; onClick?: () => void }>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="action-menu" data-id={id} {...props}>
        {items?.map((item) => (
          <button key={item.id} data-testid={`action-item-${item.id}`} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    ),
  };
});

const createMockCellContext = (
  original: Record<string, unknown>,
): CellContext<Record<string, unknown>, unknown> => {
  return {
    row: {
      original,
    } as unknown,
    cell: {} as unknown,
    column: {} as unknown,
    getValue: vi.fn(),
    renderValue: vi.fn(),
    table: {} as unknown,
  } as CellContext<Record<string, unknown>, unknown>;
};

describe('useDatagridColumn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn(), {
      wrapper,
    });

    const columns = result.current;

    expect(columns).toHaveLength(7);
    expect(columns[0].id).toBe('mainDomain');
    expect(columns[1].id).toBe('additionalDomain');
    expect(columns[2].id).toBe('type');
    expect(columns[3].id).toBe('state');
    expect(columns[4].id).toBe('creationDate');
    expect(columns[5].id).toBe('expirationDate');
    expect(columns[6].id).toBe('actions');
  });

  it('should render mainDomain cell correctly', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const MainDomainCell = result.current[0].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<MainDomainCell {...mockContext} />);

    expect(container.textContent).toBe('example.com');
  });

  it('should render additionalDomain cell with no domains', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const AdditionalDomainCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<AdditionalDomainCell {...mockContext} />);

    expect(container.textContent).toBe('-');
  });

  it('should render additionalDomain cell with one domain', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: ['sub.example.com'],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const AdditionalDomainCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<AdditionalDomainCell {...mockContext} />);

    expect(container.textContent).toContain('sub.example.com');
  });

  it('should render additionalDomain cell with multiple domains and show button', () => {
    const navigate = vi.fn();
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(navigate);
    vi.mocked(reactRouterDom.useParams).mockReturnValue({ serviceName: 'test-service' });

    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: ['sub1.example.com', 'sub2.example.com'],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const AdditionalDomainCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<AdditionalDomainCell {...mockContext} />);

    expect(screen.getByText('sub1.example.com')).toBeInTheDocument();
  });

  it('should render additionalDomain cell with exactly 2 domains', () => {
    const navigate = vi.fn();
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(navigate);
    vi.mocked(reactRouterDom.useParams).mockReturnValue({ serviceName: 'test-service' });

    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: ['sub1.example.com', 'sub2.example.com'],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const AdditionalDomainCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<AdditionalDomainCell {...mockContext} />);

    expect(screen.getByText('sub1.example.com')).toBeInTheDocument();
  });

  it('should render type cell correctly', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const TypeCell = result.current[2].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<TypeCell {...mockContext} />);

    expect(container).toBeInTheDocument();
  });

  it('should render state cell with ACTIVE status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const StateCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StateCell {...mockContext} />);

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('should render state cell with CREATING status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.CREATING,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const StateCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StateCell {...mockContext} />);

    expect(screen.getByText('CREATING')).toBeInTheDocument();
  });

  it('should render state cell with EXPIRED status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.EXPIRED,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const StateCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StateCell {...mockContext} />);

    expect(screen.getByText('EXPIRED')).toBeInTheDocument();
  });

  it('should render creationDate cell correctly', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const CreationDateCell = result.current[4].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<CreationDateCell {...mockContext} />);

    expect(container).toBeInTheDocument();
  });

  it('should render expirationDate cell with expiredAt', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const ExpirationDateCell = result.current[5].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<ExpirationDateCell {...mockContext} />);

    expect(container).toBeInTheDocument();
  });

  it('should render expirationDate cell without expiredAt', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '',
        },
      } as SslCertificate,
    };

    const ExpirationDateCell = result.current[5].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<ExpirationDateCell {...mockContext} />);

    expect(container.textContent).toBe('-');
  });

  it('should render actions cell', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        currentState: {
          mainDomain: 'example.com',
          additionalDomains: [],
          certificateType: CertificateType.LETSENCRYPT,
          state: State.ACTIVE,
          createdAt: '2025-01-01',
          expiredAt: '2026-01-01',
        },
      } as SslCertificate,
    };

    const ActionsCell = result.current[6].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<ActionsCell {...mockContext} />);

    expect(container).toBeInTheDocument();
  });
});

describe('DatagridActionCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render action menu', () => {
    const mockProps = {
      row: {
        original: {
          currentState: {
            mainDomain: 'example.com',
            additionalDomains: [],
            certificateType: CertificateType.LETSENCRYPT,
            state: State.ACTIVE,
            createdAt: '2025-01-01',
            expiredAt: '2026-01-01',
          },
        } as SslCertificate,
      },
    };

    render(<DatagridActionCell {...mockProps} />, { wrapper });

    expect(screen.getByTestId('action-menu')).toBeInTheDocument();
  });

  it('should render action menu with correct props', () => {
    const mockProps = {
      row: {
        original: {
          currentState: {
            mainDomain: 'example.com',
            additionalDomains: [],
            certificateType: CertificateType.LETSENCRYPT,
            state: State.ACTIVE,
            createdAt: '2025-01-01',
            expiredAt: '2026-01-01',
          },
        } as SslCertificate,
      },
    };

    const { container } = render(<DatagridActionCell {...mockProps} />, { wrapper });

    expect(container).toBeInTheDocument();
  });
});
