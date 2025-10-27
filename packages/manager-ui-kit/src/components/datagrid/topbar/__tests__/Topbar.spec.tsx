import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { type FilterComparator } from '@ovh-ux/manager-core-api';

import { render } from '@/commons/tests-utils/Render.utils';

import {
  mockColumnVisibility,
  mockColumns,
  mockColumnsWithoutVisibility,
  mockFilters,
  mockSearch,
  mockSetColumnVisibility,
  mockVisibleColumns,
  mockVisibleColumnsWithoutHiding,
} from '../../__mocks__';
import { Topbar } from '../Topbar.component';

vi.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vi.fn(() => ({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  })),
}));

describe('Topbar', () => {
  it('should render the topbar with basic props', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );

    expect(screen.getByTestId('topbar-container')).toBeInTheDocument();
  });

  it('should render custom topbar content', () => {
    const customTopbar = <div>Custom topbar content</div>;
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        topbar={customTopbar}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.getByText('Custom topbar content')).toBeInTheDocument();
  });

  it('should render search component when enabled', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        search={mockSearch}
        enableSearch
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should not render search when disabled', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        search={mockSearch}
        enableSearch={false}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('should render filter component when enabled', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        filters={mockFilters}
        enableFilter
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.getByTestId('datagrid-topbar-filters')).toBeInTheDocument();
  });

  it('should not render filter when disabled', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableFilter={false}
        filters={mockFilters}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.queryByTestId('datagrid-topbar-filters')).not.toBeInTheDocument();
  });

  it('should render column visibility when enabled', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableColumnvisibility
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.getByText('Colonnes')).toBeInTheDocument();
  });

  it('should not render column visibility when disabled', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        enableColumnvisibility={false}
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.queryByText('Colonnes')).not.toBeInTheDocument();
  });

  it('should render filter list when filters are active', () => {
    const filtersWithData = {
      add: vi.fn(),
      remove: vi.fn(),
      filters: [
        {
          key: 'name',
          label: 'Name',
          value: 'John',
          comparator: 'contains' as FilterComparator,
        },
      ],
    };

    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        filters={filtersWithData}
        enableFilter
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.getByTestId('datagrid-filter-list')).toBeInTheDocument();
  });

  it('should not render filter list when no active filters', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        filters={mockFilters}
        enableFilter
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.queryByTestId('datagrid-filter-list')).not.toBeInTheDocument();
  });

  it('should render all features when enabled', () => {
    const customTopbar = <div>Custom topbar content</div>;
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        topbar={customTopbar}
        search={mockSearch}
        filters={mockFilters}
        enableFilter
        enableSearch
        enableColumnvisibility
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.getByText('Custom topbar content')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByTestId('datagrid-topbar-filters')).toBeInTheDocument();
    expect(screen.getByText('Colonnes')).toBeInTheDocument();
  });

  it('should render with resource type', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        filters={mockFilters}
        resourceType="users"
        enableFilter
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.getByTestId('datagrid-topbar-filters')).toBeInTheDocument();
  });

  it('should render with empty visible columns', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={[]}
        enableColumnvisibility
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.queryByText('Colonnes')).not.toBeInTheDocument();
  });

  it('should handle search input changes', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        search={mockSearch}
        enableSearch
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'new search' } });
    expect(mockSearch.setSearchInput).toHaveBeenCalledWith('new search');
  });

  it('should handle search form submission', () => {
    render(
      <Topbar
        columns={mockColumns}
        visibleColumns={mockVisibleColumns}
        search={mockSearch}
        enableSearch
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    const form = screen.getByRole('searchbox').closest('form');
    fireEvent.submit(form);
    expect(mockSearch.onSearch).toHaveBeenCalledWith('test');
  });

  it('should render with columns that have no search feature', () => {
    const columnsWithoutSearch = [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        isSearchable: false,
        isFilterable: true,
        enableHiding: true,
      },
    ];
    render(
      <Topbar
        columns={columnsWithoutSearch}
        visibleColumns={mockVisibleColumns}
        search={mockSearch}
        enableSearch
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('should render with columns that have no visibility feature', () => {
    render(
      <Topbar
        columns={mockColumnsWithoutVisibility}
        visibleColumns={mockVisibleColumnsWithoutHiding}
        enableColumnvisibility
        columnVisibility={mockColumnVisibility}
        setColumnVisibility={mockSetColumnVisibility}
        getIsAllColumnsVisible={vi.fn(() => true)}
        getIsSomeColumnsVisible={vi.fn(() => false)}
        toggleAllColumnsVisible={vi.fn()}
      />,
    );

    expect(screen.queryByText('Colonnes')).not.toBeInTheDocument();
  });
});
