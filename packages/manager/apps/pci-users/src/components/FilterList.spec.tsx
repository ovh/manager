import { vi } from 'vitest';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { OsdsChip } from '@ovhcloud/ods-components';
import FilterList, { FilterListProps } from './FilterList';

const renderComponent = (props: FilterListProps) => {
  return render(<FilterList {...props} />);
};

describe('FilterList tests', () => {
  it('should not display chips when the filters props is empty', () => {
    const propsWithEmptyFilters = {
      filters: [],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container } = renderComponent(propsWithEmptyFilters);

    expect(container).toBeEmptyDOMElement();
  });

  it('should display 1 chip when the filters array props have one element', () => {
    const propsWithOneFiltersItem = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'Hamid',
          label: "Nom d'utilisateur",
        },
      ],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container, getAllByTestId } = renderComponent(
      propsWithOneFiltersItem,
    );

    const filterChipItems = getAllByTestId('filter-list_chip_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItems).toHaveLength(1);
  });

  it('should display 2 chips when the filters array props have two elements', () => {
    const propsWithTwoFiltersItem = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'Hamid',
          label: "Nom d'utilisateur",
        },
        {
          key: 'username',
          comparator: 'includes',
          value: 'LIDRISSI',
          label: "Nom d'utilisateur",
        },
      ],
      onRemoveFilter: vi.fn(),
    } as FilterListProps;

    const { container, getAllByTestId } = renderComponent(
      propsWithTwoFiltersItem,
    );

    const filterChipItems = getAllByTestId('filter-list_chip_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItems).toHaveLength(2);
  });

  it('should call onRemoveFilter function when the chip cross is clicked', () => {
    const mockOnRemoveFilter = vi.fn();
    const propsWithOneFiltersItem = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'Hamid',
          label: "Nom d'utilisateur",
        },
      ],
      onRemoveFilter: mockOnRemoveFilter,
    } as FilterListProps;

    const { getByTestId } = renderComponent(propsWithOneFiltersItem);

    const filterChipItem = (getByTestId(
      'filter-list_chip_item',
    ) as unknown) as OsdsChip;

    act(() => {
      filterChipItem.odsChipRemoval.emit();
    });

    expect(mockOnRemoveFilter).toHaveBeenNthCalledWith(1, {
      comparator: 'includes',
      key: 'username',
      label: "Nom d'utilisateur",
      value: 'Hamid',
    });
  });
});
