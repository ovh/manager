import React from 'react';
import { vitest } from 'vitest';
import { FilterAdd, FilterAddProps } from './filter-add.component';
import { render } from '../../utils/test.provider';

const renderComponent = (props: FilterAddProps) => {
  return render(<FilterAdd {...props} />);
};

describe('FilterAdd tests', () => {
  it('should deactivate the add filter button when value est undefined', () => {
    const mockOnAddFilter = vitest.fn();
    const props = {
      columns: [
        {
          id: 'username',
          label: "Nom d'utilisateur",
          comparators: [
            'includes',
            'starts_with',
            'ends_with',
            'is_equal',
            'is_different',
          ],
        },
      ],
      onAddFilter: mockOnAddFilter,
    } as FilterAddProps;

    const { getByTestId } = renderComponent(props);

    const addFilterButton = getByTestId('filter-add_submit');

    expect(addFilterButton).toHaveProperty('disabled');
  });

  it('should set the id of first columns items as value of the id select', () => {
    const mockOnAddFilter = vitest.fn();
    const props = {
      columns: [
        {
          id: 'username',
          label: "Nom d'utilisateur",
          comparators: [
            'includes',
            'starts_with',
            'ends_with',
            'is_equal',
            'is_different',
          ],
        },
      ],
      onAddFilter: mockOnAddFilter,
    } as FilterAddProps;

    const { getByTestId } = renderComponent(props);

    const idColumnSelect = getByTestId('add-filter_select_idColumn');
    expect(idColumnSelect).toHaveValue(props.columns[0].id);
  });
});
