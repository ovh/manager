import React from 'react';
import { vitest } from 'vitest';
import { act, fireEvent, waitFor } from '@testing-library/react';
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
    expect(addFilterButton).toHaveAttribute('is-disabled', 'true');
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

  it('should display a date picker when the filter type is Date', () => {
    const mockOnAddFilter = vitest.fn();
    const props = {
      columns: [
        {
          id: 'createdAt',
          label: 'Created At',
          type: 'Date',
          comparators: ['is_before', 'is_after', 'is_equal'],
        },
      ],
      onAddFilter: mockOnAddFilter,
    } as FilterAddProps;

    const { getByTestId } = renderComponent(props);

    const valueField = getByTestId('filter-add_value-date');
    expect(valueField.tagName).toBe('ODS-DATEPICKER');
  });

  it('should return a valid date string when a date is set in the value field', async () => {
    const mockOnAddFilter = vitest.fn();
    const props = {
      columns: [
        {
          id: 'createdAt',
          label: 'Created At',
          type: 'Date',
          comparators: ['is_before', 'is_after', 'is_equal'],
        },
      ],
      onAddFilter: mockOnAddFilter,
    } as FilterAddProps;

    const { getByTestId } = renderComponent(props);

    const valueField = getByTestId('filter-add_value-date');
    const addFilterButton = getByTestId('filter-add_submit');

    const testDate = new Date('2023-10-01');
    const isoDate = testDate.toISOString();

    act(() => {
      fireEvent.change(valueField, { target: { value: testDate } });
    });

    await waitFor(() => {
      expect(addFilterButton).toHaveAttribute('is-disabled', 'false');
    });

    act(() => {
      addFilterButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(mockOnAddFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'createdAt',
        value: isoDate,
      }),
      expect.objectContaining({
        id: 'createdAt',
        type: 'Date',
      }),
    );
  });
});

it('should set the select option', () => {
  const mockOnAddFilter = vitest.fn();
  const props = {
    columns: [
      {
        id: 'status',
        label: 'Status',
        comparators: [
          'includes',
          'starts_with',
          'ends_with',
          'is_equal',
          'is_different',
        ],
        options: [
          { label: 'option1', value: 'option_1' },
          { label: 'option2', value: 'option_2' },
        ],
      },
    ],
    onAddFilter: mockOnAddFilter,
  } as FilterAddProps;

  const { getByTestId } = renderComponent(props);

  const idSelect = getByTestId('filter-add_value-select');
  expect(idSelect).toBeDefined();
});
