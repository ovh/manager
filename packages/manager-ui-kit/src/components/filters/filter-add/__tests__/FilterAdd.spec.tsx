import { act, fireEvent, waitFor } from '@testing-library/react';
import { vi, vitest } from 'vitest';

import { render } from '@/setupTest';

import { useAuthorizationIam } from '../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../hooks/iam/iam.interface';
import { TagsFilterFormProps } from '../../Filter.props';
import { FilterAddProps } from '../FilterAdd.props';
import { FilterAdd } from '../Filteradd.component';

vi.mock('../../../../hooks/iam');

vi.mock('./tags-filter-form.component', () => {
  return {
    TagsFilterForm: ({ setTagKey }: TagsFilterFormProps) => {
      setTagKey('tagKey');
      return <div data-testid="filter-tag-inputs" />;
    },
  };
});

vi.mock('@ovhcloud/ods-react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-react');
  return {
    ...actual,
    Datepicker: ({ onValueChange, value, children, ...props }: any) => (
      <div {...props}>
        <input
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            const dateValue = e.target.value ? new Date(e.target.value) : null;
            onValueChange({ value: dateValue });
          }}
        />
        {children}
      </div>
    ),
    DatepickerControl: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    DatepickerContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  };
});

const mockedHook = useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

const renderComponent = (props: FilterAddProps) => {
  return render(<FilterAdd {...props} />);
};

describe('FilterAdd tests', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  it('should deactivate the add filter button when value est undefined', () => {
    const mockOnAddFilter = vitest.fn();
    const props = {
      columns: [
        {
          id: 'username',
          label: "Nom d'utilisateur",
          comparators: ['includes', 'starts_with', 'ends_with', 'is_equal', 'is_different'],
        },
      ],
      onAddFilter: mockOnAddFilter,
    } as FilterAddProps;

    const { getByTestId } = renderComponent(props);

    const addFilterButton = getByTestId('filter-add_submit');
    expect(addFilterButton).toBeDisabled();
  });

  it('should set the id of first columns items as value of the id select', () => {
    const mockOnAddFilter = vitest.fn();
    const props = {
      columns: [
        {
          id: 'username',
          label: "Nom d'utilisateur",
          comparators: ['includes', 'starts_with', 'ends_with', 'is_equal', 'is_different'],
        },
      ],
      onAddFilter: mockOnAddFilter,
    } as FilterAddProps;

    const { getByTestId } = renderComponent(props);

    const idColumnSelect = getByTestId('add-filter_select_idColumn');
    // how to get the value of the selection
    const value = idColumnSelect.querySelector('select')?.value;
    expect(value).toBe('username');
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
    expect(valueField).toBeVisible();
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

    const dateContainer = getByTestId('filter-add_value-date');
    const dateInput = dateContainer.querySelector('input');
    const addFilterButton = getByTestId('filter-add_submit');

    const testDate = new Date('2023-10-01');
    const isoDate = testDate.toISOString();

    // Submit button should be disabled initially
    expect(addFilterButton).toBeDisabled();

    // Set a date value
    act(() => {
      fireEvent.change(dateInput, {
        target: { value: '2023-10-01' },
      });
    });

    await waitFor(() => {
      expect(addFilterButton).toBeEnabled();
    });

    act(() => {
      fireEvent.click(addFilterButton);
    });

    expect(mockOnAddFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        value: isoDate,
      }),
      expect.any(Object),
    );
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
      expect(addFilterButton).toBeDisabled();
    });

    act(() => {
      fireEvent.change(valueField, { target: { value: goodValue } });
    });

    // Submit button is enabled with a valid number
    await waitFor(() => {
      expect(addFilterButton).not.toBeDisabled();
    });

    act(() => {
      fireEvent.change(valueField, { target: { value: badValue } });
    });

    // Submit button is disabled with an invalid number
    await waitFor(() => {
      expect(addFilterButton).toBeDisabled();
    });
  });

  it('should set the select option', () => {
    const mockOnAddFilter = vitest.fn();
    const props = {
      columns: [
        {
          id: 'status',
          label: 'Status',
          comparators: ['includes', 'starts_with', 'ends_with', 'is_equal', 'is_different'],
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

    const columnSelect = getByTestId('add-filter_select_idColumn');
    fireEvent.change(columnSelect.querySelector('select'), {
      target: { value: 'tags' },
    });

    const operatorSelect = getByTestId('add-operator-tags')?.querySelector('select');
    fireEvent.change(operatorSelect, {
      target: { value: 'EQ' },
    });

    const submitButton = getByTestId('filter-add_submit');
    expect(submitButton).toBeDisabled();

    act(() => {
      fireEvent.change(operatorSelect, { target: { value: 'EXISTS' } });
    });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    act(() => {
      fireEvent.change(operatorSelect, { target: { value: 'NOT_EXISTS' } });
    });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
