import { vi, vitest } from 'vitest';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { FilterAdd, FilterAddProps } from './filter-add.component';
import { render } from '@/setupTest';
import { TagsFilterFormProps } from './interface';

vi.mock('./tags-filter-form.component', () => {
  return {
    TagsFilterForm: ({ setTagKey }: TagsFilterFormProps) => {
      setTagKey('tagKey');
      return <div data-testid="filter-tag-inputs" />;
    },
  };
});

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
    expect(idColumnSelect).toHaveValue(props.columns[0]?.id);
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

it('should disable submit button when the filter type is Numeric and the value is not', async () => {
  const mockOnAddFilter = vitest.fn();
  const props = {
    columns: [
      {
        id: 'size',
        label: 'Size',
        type: 'Numeric',
        comparators: ['is_lower', 'is_higher', 'is_equal'],
      },
    ],
    onAddFilter: mockOnAddFilter,
  } as FilterAddProps;

  const { getByTestId } = renderComponent(props);

  const valueField = getByTestId('filter-add_value-numeric');
  const addFilterButton = getByTestId('filter-add_submit');

  const badValue = 'foo';
  const goodValue = '-123.12';

  // Submit button is initially disabled
  await waitFor(() => {
    expect(addFilterButton).toHaveAttribute('is-disabled', 'true');
  });

  act(() => {
    fireEvent.change(valueField, { target: { value: goodValue } });
  });

  // Submit button is enabled with a valid number
  await waitFor(() => {
    expect(addFilterButton).toHaveAttribute('is-disabled', 'false');
  });

  act(() => {
    fireEvent.change(valueField, { target: { value: badValue } });
  });

  // Submit button is disabled with an invalid number
  await waitFor(() => {
    expect(addFilterButton).toHaveAttribute('is-disabled', 'true');
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

it('should display tag filter form if the filter is a tag', () => {
  const mockOnAddFilter = vitest.fn();
  const props = {
    columns: [
      {
        id: 'tags',
        label: 'Tags',
        type: 'Tags',
        comparators: ['EQ', 'NEQ', 'EXISTS', 'NOT_EXISTS'],
      },
    ],
    onAddFilter: mockOnAddFilter,
  } as FilterAddProps;

  const { getByTestId } = renderComponent(props);

  const tagInputs = getByTestId('filter-tag-inputs');
  expect(tagInputs).toBeDefined();
});

it('should display tags inputs if the filter is a tag', () => {
  const mockOnAddFilter = vitest.fn();
  const props = {
    columns: [
      {
        id: 'tags',
        label: 'Tags',
        type: 'Tags',
        comparators: ['EQ', 'NEQ', 'EXISTS', 'NOT_EXISTS'],
      },
    ],
    onAddFilter: mockOnAddFilter,
  } as FilterAddProps;

  const { getByTestId } = renderComponent(props);

  const tagInputs = getByTestId('filter-tag-inputs');
  expect(tagInputs).toBeDefined();
});

it('should disable submit if tag value is not set and comparator is not EXISTS/NOT_EXISTS', async () => {
  const mockOnAddFilter = vitest.fn();
  const props = {
    columns: [
      {
        id: 'tags',
        label: 'Tags',
        type: 'Tags',
        comparators: ['EQ', 'NEQ', 'EXISTS', 'NOT_EXISTS'],
      },
    ],
    onAddFilter: mockOnAddFilter,
  } as FilterAddProps;

  const { getByTestId } = renderComponent(props);

  // Select tags column
  const columnSelect = getByTestId('add-filter_select_idColumn');
  fireEvent.change(columnSelect, { target: { value: 'tags' } });

  // Select EQ comparator
  const operatorSelect = getByTestId('add-operator-tags');
  fireEvent.change(operatorSelect, { target: { value: 'EQ' } });

  // Submit should be disabled when no tag value set
  const submitButton = getByTestId('filter-add_submit');
  expect(submitButton).toHaveAttribute('is-disabled', 'true');

  // Change to EXISTS comparator
  act(() => {
    fireEvent.change(operatorSelect, { target: { value: 'EXISTS' } });
  });

  await waitFor(() => {
    expect(submitButton).toHaveAttribute('is-disabled', 'false');
  });

  // Change to NOT_EXISTS comparator
  act(() => {
    fireEvent.change(operatorSelect, { target: { value: 'NOT_EXISTS' } });
  });

  await waitFor(() => {
    expect(submitButton).toHaveAttribute('is-disabled', 'false');
  });
});
