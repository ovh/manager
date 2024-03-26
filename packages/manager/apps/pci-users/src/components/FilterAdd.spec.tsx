import { render } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import 'element-internals-polyfill';
import FilterAdd, { FilterAddProps } from './FilterAdd';

const renderComponent = (props: FilterAddProps) => {
  return render(<FilterAdd {...props} />);
};

describe('FilterAdd tests', () => {
  it('should deactivate the add filter button when value est undefined', () => {
    const mockOnAddFilter = vi.fn();
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
    const mockOnAddFilter = vi.fn();
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
