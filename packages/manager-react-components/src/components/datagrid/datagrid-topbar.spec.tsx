import { vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import DataGridTextCell from './text-cell.component';
import { FilterProps } from './datagrid-topbar.component';
import { DatagridTopbar } from './datagrid-topbar.component';

vitest.mock('react-i18next', async () => {
  const originalModule = await vitest.importActual('react-i18next');

  return {
    ...originalModule,
    useTranslation: () => {
      return {
        t: (str: string) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
  };
});

const columns = [
  {
    id: 'name',
    cell: (name: string) => {
      return <span>{name}</span>;
    },
    label: 'Name',
    comparator: FilterCategories.String,
    isFilterable: true,
    isSearchable: true,
  },
  {
    id: 'another-column',
    label: 'test',
    cell: () => <DataGridTextCell />,
    comparator: FilterCategories.String,
    isFilterable: true,
    isSearchable: true,
  },
];

const columnsWithoutSearch = [
  {
    id: 'name',
    cell: (name: string) => {
      return <span>{name}</span>;
    },
    label: 'Name',
    comparator: FilterCategories.String,
    isFilterable: true,
  },
  {
    id: 'another-column',
    label: 'test',
    cell: () => <DataGridTextCell />,
    comparator: FilterCategories.String,
    isFilterable: true,
  },
];

const filters = {
  filters: [
    {
      key: 'customName',
      comparator: 'includes',
      value: 'coucou',
      label: 'customName',
    },
  ],
  add: null,
  remove: null,
} as FilterProps;

const search = {
  searchInput: '',
  setSearchInput: () => {},
  onSearch: () => {},
};

describe('datagrid topbar', () => {
  beforeAll(() => {
    // Mock attachInternals method for all instances of custom elements
    (HTMLElement.prototype.attachInternals as unknown) = vitest.fn(() => ({
      // Mock the properties or methods used from internals
      setValidity: vitest.fn(),
      states: new Set(),
      setFormValue: vitest.fn(),
    }));
  });

  it('should display the search bar component', async () => {
    render(
      <DatagridTopbar columns={columns} filters={filters} search={search} />,
    );
    const searchElement = screen.queryByTestId('datagrid-topbar-search');
    expect(searchElement).toBeInTheDocument();
  });

  it('should not display the search bar component', async () => {
    render(
      <DatagridTopbar
        columns={columnsWithoutSearch}
        filters={filters}
        search={search}
      />,
    );
    const searchElement = screen.queryByTestId('datagrid-topbar-search');
    expect(searchElement).not.toBeInTheDocument();
  });

  it('should display the search bar and filters add component', async () => {
    render(
      <DatagridTopbar columns={columns} filters={filters} search={search} />,
    );
    const searchElement = screen.queryByTestId('datagrid-topbar-search');
    expect(searchElement).toBeInTheDocument();
    const filterElement = screen.queryByTestId('datagrid-topbar-filters');
    expect(filterElement).toBeInTheDocument();
  });

  it('should display filters add and list component', async () => {
    render(
      <DatagridTopbar columns={columns} filters={filters} search={search} />,
    );
    const filterElement = screen.queryByTestId('datagrid-topbar-filters');
    expect(filterElement).toBeInTheDocument();
    const filterListElement = screen.queryByTestId('datagrid-filter-list');
    expect(filterListElement).toBeInTheDocument();
  });
});
