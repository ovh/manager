import { act, fireEvent } from '@testing-library/react';
import { vitest } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';
import { FilterList } from '@/components/filters/filter-list/FilterList.component';

import { FilterListProps } from '../FilterList.props';

const renderComponent = (props: FilterListProps) => {
  return render(<FilterList {...props} />);
};

describe('FilterList tests', () => {
  it('should not display tags when the filters props is empty', () => {
    const propsWithEmptyFilters = {
      filters: [],
      onRemoveFilter: vitest.fn(),
    } as FilterListProps;

    const { container } = renderComponent(propsWithEmptyFilters);

    expect(container).toBeEmptyDOMElement();
  });

  it('should display 1 tag when the filters array props have one element', () => {
    const propsWithOneFiltersItem = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'temp_user',
          label: "Nom d'utilisateur",
        },
      ],
      onRemoveFilter: vitest.fn(),
    } as FilterListProps;

    const { container, getAllByTestId } = renderComponent(propsWithOneFiltersItem);

    const filterChipItems = getAllByTestId('filter-list_tag_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItems).toHaveLength(1);
  });

  it('should display displayValue if exists', () => {
    const propsWithOneFiltersItem = {
      filters: [
        {
          key: 'os',
          comparator: 'is_in',
          displayValue: 'windows',
          value: 'win_64,win32,win_server64,win_server32',
          label: 'operating system',
        },
      ],
      onRemoveFilter: vitest.fn(),
    } as FilterListProps;

    const { container, getByTestId } = renderComponent(propsWithOneFiltersItem);

    const filterChipItem = getByTestId('filter-list_tag_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItem.textContent).toContain('windows');
  });

  it('should display 2 tags when the filters array props have two elements', () => {
    const propsWithTwoFiltersItem = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'random_user',
          label: "Nom d'utilisateur",
        },
        {
          key: 'username',
          comparator: 'includes',
          value: 'temp_user',
          label: "Nom d'utilisateur",
        },
      ],
      onRemoveFilter: vitest.fn(),
    } as FilterListProps;

    const { container, getAllByTestId } = renderComponent(propsWithTwoFiltersItem);

    const filterChipItems = getAllByTestId('filter-list_tag_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItems).toHaveLength(2);
  });

  it('should display a formatted date when the filter type is a Date', () => {
    const propsWithDateFilter = {
      filters: [
        {
          key: 'createdAt',
          comparator: 'is_equal',
          value: new Date('2023-10-01').toISOString(),
          label: 'Creation Date',
          type: 'Date',
        },
      ],
      onRemoveFilter: vitest.fn(),
    } as FilterListProps;

    const { container, getByTestId } = renderComponent(propsWithDateFilter);

    const filterChipItem = getByTestId('filter-list_tag_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItem.textContent).toContain('Creation Date');
    expect(filterChipItem.textContent).toContain('01/10/2023');
  });

  it('should call onRemoveFilter function when the chip cross is clicked', () => {
    const mockOnRemoveFilter = vitest.fn();
    const propsWithOneFiltersItem = {
      filters: [
        {
          key: 'username',
          comparator: 'includes',
          value: 'temp_user',
          label: "Nom d'utilisateur",
        },
      ],
      onRemoveFilter: mockOnRemoveFilter,
    } as FilterListProps;

    const { getByTestId } = renderComponent(propsWithOneFiltersItem);

    const filterChipItem = getByTestId('filter-list_tag_item');

    act(() => {
      fireEvent.click(filterChipItem);
    });

    expect(mockOnRemoveFilter).toHaveBeenNthCalledWith(1, {
      comparator: 'includes',
      key: 'username',
      label: "Nom d'utilisateur",
      value: 'temp_user',
    });
  });
});
