import type { CellContext } from '@tanstack/react-table';
import '@testing-library/jest-dom';
import { render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskDetailsType } from '@/data/types/product/webHosting';
import useDatagridColumn from '@/hooks/task/useDatagridColumn';
import { wrapper } from '@/utils/test.provider';

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual<typeof import('@ovh-ux/muk')>('@ovh-ux/muk');
  return {
    ...actual,
    useFormatDate: () => (params: { date: string; format: string }) => {
      return `formatted-${params.date}`;
    },
  };
});

const createMockCellContext = (
  original: TaskDetailsType,
): CellContext<TaskDetailsType, unknown> => {
  return {
    row: {
      original,
    } as unknown,
    cell: {} as unknown,
    column: {} as unknown,
    getValue: vi.fn(),
    renderValue: vi.fn(),
    table: {} as unknown,
  } as CellContext<TaskDetailsType, unknown>;
};

describe('useDatagridColumn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });

    const columns = result.current;

    expect(columns).toHaveLength(4);
    expect(columns[0].id).toBe('task');
    expect(columns[1].id).toBe('status');
    expect(columns[2].id).toBe('startDate');
    expect(columns[3].id).toBe('finishDate');
  });

  it('should render task cell correctly', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'done',
        startDate: '2025-01-01T00:00:00Z',
        doneDate: '2025-01-01T01:00:00Z',
      } as TaskDetailsType,
    };

    const TaskCell = result.current[0].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<TaskCell {...mockContext} />);

    expect(container).toBeInTheDocument();
  });

  it('should render status cell with done status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'done',
        startDate: '2025-01-01T00:00:00Z',
        doneDate: '2025-01-01T01:00:00Z',
      } as TaskDetailsType,
    };

    const StatusCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />);

    expect(screen.getByText('hosting_tab_TASKS_status_done')).toBeInTheDocument();
  });

  it('should render status cell with cancelled status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'cancelled',
        startDate: '2025-01-01T00:00:00Z',
      } as TaskDetailsType,
    };

    const StatusCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />);

    expect(screen.getByText('hosting_tab_TASKS_status_cancelled')).toBeInTheDocument();
  });

  it('should render status cell with doing status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'doing',
        startDate: '2025-01-01T00:00:00Z',
      } as TaskDetailsType,
    };

    const StatusCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />);

    expect(screen.getByText('hosting_tab_TASKS_status_doing')).toBeInTheDocument();
  });

  it('should render status cell with init status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'init',
        startDate: '2025-01-01T00:00:00Z',
      } as TaskDetailsType,
    };

    const StatusCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />);

    expect(screen.getByText('hosting_tab_TASKS_status_init')).toBeInTheDocument();
  });

  it('should render status cell with todo status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'todo',
        startDate: '2025-01-01T00:00:00Z',
      } as TaskDetailsType,
    };

    const StatusCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />);

    expect(screen.getByText('hosting_tab_TASKS_status_todo')).toBeInTheDocument();
  });

  it('should render status cell with error status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'error',
        startDate: '2025-01-01T00:00:00Z',
      } as unknown as TaskDetailsType,
    };

    const StatusCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />);

    expect(screen.getByText('hosting_tab_TASKS_status_error')).toBeInTheDocument();
  });

  it('should render status cell with ovhError status', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'ovhError',
        startDate: '2025-01-01T00:00:00Z',
      } as unknown as TaskDetailsType,
    };

    const StatusCell = result.current[1].cell;
    const mockContext = createMockCellContext(mockRow.original);
    render(<StatusCell {...mockContext} />);

    expect(screen.getByText('hosting_tab_TASKS_status_ovherror')).toBeInTheDocument();
  });

  it('should render startDate cell correctly', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'done',
        startDate: '2025-01-01T12:00:00Z',
        doneDate: '2025-01-01T13:00:00Z',
      } as TaskDetailsType,
    };

    const StartDateCell = result.current[2].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<StartDateCell {...mockContext} />);

    expect(container).toBeInTheDocument();
  });

  it('should render finishDate cell when doneDate exists', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'done',
        startDate: '2025-01-01T12:00:00Z',
        doneDate: '2025-01-01T13:00:00Z',
      } as TaskDetailsType,
    };

    const FinishDateCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<FinishDateCell {...mockContext} />);

    expect(container).toBeInTheDocument();
  });

  it('should render finishDate cell as null when doneDate is missing', () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'doing',
        startDate: '2025-01-01T12:00:00Z',
        doneDate: undefined,
      } as TaskDetailsType,
    };

    const FinishDateCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<FinishDateCell {...mockContext} />);

    expect(container.textContent).toBe('');
  });

  it('should have a valid html', async () => {
    const { result } = renderHook(() => useDatagridColumn(), { wrapper });
    const mockRow = {
      original: {
        function: 'web/database/create',
        status: 'done',
        startDate: '2025-01-01T12:00:00Z',
        doneDate: '2025-01-01T13:00:00Z',
      } as TaskDetailsType,
    };
    const FinishDateCell = result.current[3].cell;
    const mockContext = createMockCellContext(mockRow.original);
    const { container } = render(<FinishDateCell {...mockContext} />);
    // const html = container.innerHTML;
    // await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
