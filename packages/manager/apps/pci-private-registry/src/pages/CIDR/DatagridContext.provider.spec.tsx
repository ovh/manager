import { ColumnSort } from '@ovh-ux/manager-react-components';
import { useContext } from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { DatagridProvider, Context } from './DatagridContext.provider';

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn(),
}));

describe('DatagridProvider', () => {
  it('provides correct context values', () => {
    const mockData = [
      { checked: true, draft: false, ipBlock: '192.168.0.1' },
      { checked: false, draft: true, ipBlock: '192.168.0.2' },
    ];

    vi.mocked(useFormContext).mockReturnValue(({
      reset: vi.fn(),
    } as unknown) as UseFormReturn);

    const dataGrid = {
      pagination: { pageIndex: 0, pageSize: 10 },
      setPagination: vi.fn(),
      sorting: {} as ColumnSort,
      setSorting: vi.fn(),
    };

    const columnFilters = {
      filters: [],
      addFilter: vi.fn(() => {}),
      removeFilter: vi.fn(() => {}),
    };

    const ConsumerComponent = () => {
      const contextValue = useContext(Context);
      expect(contextValue).toBeDefined();
      expect(contextValue.rows).toEqual(mockData);
      expect(contextValue.isDraft).toBe(true);
      expect(contextValue.isAllDataSelected).toBe(false);
      return null;
    };

    render(
      <DatagridProvider
        data={mockData}
        dataGrid={dataGrid}
        columnFilters={columnFilters}
        totalRows={mockData.length}
      >
        <ConsumerComponent />
      </DatagridProvider>,
    );
  });
});
