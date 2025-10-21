import { vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { FilterProps } from './datagrid.component';
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

vitest.mock('@ovhcloud/ods-components/react', async () => {
  const originalModule = await vitest.importActual(
    '@ovhcloud/ods-components/react',
  );

  return {
    ...originalModule,
    OdsCheckbox: (column: any) => (
      <input
        type="checkbox"
        name={column.id}
        id={column.id}
        checked={column.isVisible}
        disabled={column.isDisabled}
        onChange={column.onChange}
      />
    ),
  };
});

const filtersColumns = [
  {
    id: 'ip',
    label: 'ip',
    comparators: FilterCategories.String,
  },
  {
    id: 'os',
    label: 'os',
    comparators: FilterCategories.String,
  },
  {
    id: 'name',
    label: 'name',
    comparators: FilterCategories.String,
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
  add: () => {},
  remove: () => {},
} as FilterProps;

const search = {
  searchInput: '',
  setSearchInput: () => {},
  onSearch: () => {},
};

describe('datagrid topbar', () => {
  it('should display the search bar component', async () => {
    render(<DatagridTopbar isSearchable={true} search={search} />);
    const searchElement = screen.queryByTestId('datagrid-searchbar');
    expect(searchElement).toBeInTheDocument();
  });

  it('should not display the search bar component', async () => {
    render(<DatagridTopbar isSearchable={false} search={search} />);
    const searchElement = screen.queryByTestId('datagrid-searchbar');
    expect(searchElement).not.toBeInTheDocument();
  });

  it('should display the search bar and filters add component', async () => {
    render(
      <DatagridTopbar
        filters={filters}
        filtersColumns={filtersColumns}
        isSearchable={true}
        search={search}
      />,
    );
    const searchElement = screen.queryByTestId('datagrid-searchbar');
    expect(searchElement).toBeInTheDocument();
    const filterElement = screen.queryByTestId('datagrid-topbar-filters');
    expect(filterElement).toBeInTheDocument();
  });

  it('should display filters add and list component', async () => {
    render(
      <DatagridTopbar
        filters={filters}
        filtersColumns={filtersColumns}
        isSearchable={true}
        search={search}
      />,
    );
    const filterElement = screen.queryByTestId('datagrid-topbar-filters');
    expect(filterElement).toBeInTheDocument();
    const filterListElement = screen.queryByTestId('datagrid-filter-list');
    expect(filterListElement).toBeInTheDocument();
  });

  it('should display only topbar element', async () => {
    const topbar = <div data-testid="custom-topbar-element">CTA button</div>;
    render(<DatagridTopbar topbar={topbar} />);
    const filterListElement = screen.queryByTestId('custom-topbar-element');
    expect(filterListElement).toBeInTheDocument();
  });

  it('should display visibility component', () => {
    render(
      <DatagridTopbar
        columnsVisibility={[
          {
            id: 'label',
            label: 'Label',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => true,
            onChange: () => null,
          },
          {
            id: 'price',
            label: 'Price',
            enableHiding: true,
            isDisabled: false,
            isVisible: () => true,
            onChange: () => null,
          },
        ]}
        toggleAllColumnsVisible={() => null}
        getIsAllColumnsVisible={() => true}
        getIsSomeColumnsVisible={() => true}
      />,
    );

    const visibilityElement = screen.queryByTestId(
      'datagrid-topbar-visibility-button',
    );

    expect(visibilityElement).toHaveAttribute('label', 'common_topbar_columns');
  });
});
