import * as reactRouterDom from 'react-router-dom';

import type { CellContext, Row } from '@tanstack/react-table';
import '@testing-library/jest-dom';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LocalSeoType, SeoCountry, SeoOffer } from '@/data/types/product/seo';
import { SeoStatus } from '@/data/types/status';
import useDatagridColumn, { DatagridActionCell } from '@/hooks/localSeo/useDatagridColumn';
import { wrapper } from '@/utils/test.provider';

const createMockCellContext = (original: LocalSeoType): CellContext<LocalSeoType, unknown> => {
  return {
    row: {
      original,
    } as unknown,
    cell: {} as unknown,
    column: {} as unknown,
    getValue: vi.fn(),
    renderValue: vi.fn(),
    table: {} as unknown,
  } as CellContext<LocalSeoType, unknown>;
};

const mockOpen = vi.fn();
const originalOpen = window.open;

describe('useDatagridColumn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.open = mockOpen;
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });

    const columns = result.current;

    expect(columns).toHaveLength(5);
    expect(columns[0].id).toBe('name');
    expect(columns[1].id).toBe('address');
    expect(columns[2].id).toBe('email');
    expect(columns[3].id).toBe('status');
    expect(columns[4].id).toBe('actions');
  });

  it('should render name cell correctly', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        accountId: 123,
        status: SeoStatus.CREATED,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    };

    const NameCell = result.current[0].cell;
    const mockContext = { row: mockRow } as unknown as CellContext<LocalSeoType, unknown>;
    const { container } = render(<NameCell {...mockContext} />);

    expect(container.textContent).toBe('Test Company');
  });

  it('should render address cell with address', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        address: '123 Test Street',
        accountId: 123,
        status: SeoStatus.CREATED,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const AddressCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<AddressCell {...mockContext} />);

    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
  });

  it('should render address cell with undefined badge when address is missing', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        address: undefined,
        accountId: 123,
        status: SeoStatus.CREATED,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const AddressCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<AddressCell {...mockContext} />, { wrapper });

    expect(screen.getByText('hosting_tab_LOCAL_SEO_table_value_undefined')).toBeInTheDocument();
  });

  it('should render email cell', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        accountId: 123,
        status: SeoStatus.CREATED,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const EmailCell = result.current[2].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<EmailCell {...mockContext} />, { wrapper });

    expect(container).toBeInTheDocument();
  });

  it('should render status cell with created status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        accountId: 123,
        status: SeoStatus.CREATED,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const StatusCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />, { wrapper });

    expect(screen.getByText('hosting_tab_LOCAL_SEO_state_created')).toBeInTheDocument();
  });

  it('should render status cell with creating status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        accountId: 123,
        status: SeoStatus.CREATING,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const StatusCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />, { wrapper });

    expect(screen.getByText('hosting_tab_LOCAL_SEO_state_creating')).toBeInTheDocument();
  });

  it('should render status cell with deleting status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        accountId: 123,
        status: SeoStatus.DELETING,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const StatusCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />, { wrapper });

    expect(screen.getByText('hosting_tab_LOCAL_SEO_state_deleting')).toBeInTheDocument();
  });

  it('should render status cell with updating status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        accountId: 123,
        status: SeoStatus.UPDATING,
        id: 'test-id',
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const StatusCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />, { wrapper });

    expect(screen.getByText('hosting_tab_LOCAL_SEO_state_updating')).toBeInTheDocument();
  });

  it('should render actions cell', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        name: 'Test Company',
        accountId: 123,
        id: 'test-id',
        status: SeoStatus.CREATED,
        country: SeoCountry.FR,
        creationDate: '2025-01-01',
        lastUpdate: '2025-01-01',
        offer: SeoOffer.NORMAL,
        taskId: 0,
      } as LocalSeoType,
    } as unknown as Row<LocalSeoType>;

    const ActionsCell = result.current[4].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<ActionsCell {...mockContext} />, { wrapper });

    expect(container).toBeInTheDocument();
  });
});

describe('DatagridActionCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.open = mockOpen;
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it('should render action menu', () => {
    const mockProps: LocalSeoType = {
      accountId: 123,
      id: 'test-id',
      name: 'Test Company',
      address: '123 Test Street',
      status: SeoStatus.CREATED,
      country: SeoCountry.FR,
      creationDate: '2025-01-01',
      lastUpdate: '2025-01-01',
      offer: SeoOffer.NORMAL,
      taskId: 0,
    };

    render(<DatagridActionCell {...mockProps} />, { wrapper });

    expect(screen.getByTestId('action-menu')).toBeInTheDocument();
  });

  it('should open interface when access interface is clicked', async () => {
    const mockProps: LocalSeoType = {
      accountId: 123,
      id: 'test-id',
      name: 'Test Company',
      address: '123 Test Street',
      status: SeoStatus.CREATED,
      country: SeoCountry.FR,
      creationDate: '2025-01-01',
      lastUpdate: '2025-01-01',
      offer: SeoOffer.NORMAL,
      taskId: 0,
    };

    mockOpen.mockReturnValue({
      location: { href: '' },
    } as Window);

    render(<DatagridActionCell {...mockProps} />, { wrapper });

    const button = screen.getByTestId('action-item-1');
    button.click();

    await waitFor(() => {
      expect(mockOpen).toHaveBeenCalled();
    });
  });

  it('should navigate to delete page when delete is clicked', () => {
    const navigate = vi.fn();
    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(navigate);

    const mockProps: LocalSeoType = {
      accountId: 123,
      id: 'test-id',
      name: 'Test Company',
      address: '123 Test Street',
      status: SeoStatus.CREATED,
      country: SeoCountry.FR,
      creationDate: '2025-01-01',
      lastUpdate: '2025-01-01',
      offer: SeoOffer.NORMAL,
      taskId: 0,
    };

    render(<DatagridActionCell {...mockProps} />, { wrapper });

    const button = screen.getByTestId('action-item-2');
    button.click();

    expect(navigate).toHaveBeenCalled();
  });
});
