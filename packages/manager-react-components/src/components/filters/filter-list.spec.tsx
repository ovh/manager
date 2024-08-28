import React from 'react';
import { vitest } from 'vitest';
import { OdsTag } from '@ovhcloud/ods-components';
import { act } from '@testing-library/react';
import { FilterList, FilterListProps } from './filter-list.component';
import { render } from '../../utils/test.provider';

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

    const { container, getAllByTestId } = renderComponent(
      propsWithOneFiltersItem,
    );

    const filterChipItems = getAllByTestId('filter-list_tag_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItems).toHaveLength(1);
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

    const { container, getAllByTestId } = renderComponent(
      propsWithTwoFiltersItem,
    );

    const filterChipItems = getAllByTestId('filter-list_tag_item');

    expect(container).not.toBeEmptyDOMElement();
    expect(filterChipItems).toHaveLength(2);
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

    const filterChipItem = getByTestId(
      'filter-list_tag_item',
    ) as unknown as OdsTag;

    act(() => {
      filterChipItem.onClick();
    });

    expect(mockOnRemoveFilter).toHaveBeenNthCalledWith(1, {
      comparator: 'includes',
      key: 'username',
      label: "Nom d'utilisateur",
      value: 'temp_user',
    });
  });
});
