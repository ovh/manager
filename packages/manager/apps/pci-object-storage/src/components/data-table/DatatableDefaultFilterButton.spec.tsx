import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTableDefaultFilterButton, {
  ColumnFilter,
} from './DatatableDefaultFilterButton.component';
import { FilterComparator, FilterCategories } from '@/lib/filters';
import { handleSelectComboboxText } from '@/__tests__/helpers/unitTestHelper';
import { Locale } from '@/hooks/useLocale';

// Mock useDateFnsLocale
vi.mock('@/hooks/useDateFnsLocale.hook', () => ({
  useDateFnsLocale: () => 'en-US',
}));

const getLocaleMock = vi.fn().mockResolvedValue(Locale.de_DE);
const onLocaleChangeMock = vi.fn();
const shellMock = {
  i18n: {
    getLocale: getLocaleMock,
    onLocaleChange: onLocaleChangeMock,
  },
};

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useShell: () => shellMock,
}));

const columns: ColumnFilter[] = [
  {
    id: 'name',
    label: 'Name',
    comparators: FilterCategories.String,
  },
  {
    id: 'status',
    label: 'Status',
    comparators: FilterCategories.Options,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    id: 'date',
    label: 'Date',
    comparators: FilterCategories.Date,
  },
  {
    id: 'count',
    label: 'Count',
    comparators: FilterCategories.Numeric,
  },
];

const onAddFilter = vi.fn();
describe('DataTableDefaultFilterButton', () => {
  render(
    <DataTableDefaultFilterButton
      columns={columns}
      onAddFilter={onAddFilter}
    />,
  );
  act(() => {
    const trigger = screen.getByTestId('open-filter-menu-button');
    fireEvent.focus(trigger);
    fireEvent.keyDown(trigger, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });
  });
  it('renders filter button and opens dropdown', async () => {
    expect(
      screen.getByText('common_criteria_adder_column_label'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('common_criteria_adder_operator_label'),
    ).toBeInTheDocument();
  });

  it('calls onAddFilter with string value', async () => {
    render(
      <DataTableDefaultFilterButton
        columns={columns}
        onAddFilter={onAddFilter}
      />,
    );
    act(() => {
      const trigger = screen.getByTestId('open-filter-menu-button');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    const input = screen.getByLabelText('common_criteria_adder_value_label');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(screen.getByText('common_criteria_adder_submit_label'));
    expect(onAddFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'name',
        comparator: FilterComparator.Includes,
        value: 'test',
      }),
      expect.objectContaining({ id: 'name' }),
    );
  });

  it('calls onAddFilter with select value', async () => {
    render(
      <DataTableDefaultFilterButton
        columns={columns}
        onAddFilter={onAddFilter}
      />,
    );
    act(() => {
      const trigger = screen.getByTestId('open-filter-menu-button');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await handleSelectComboboxText('select-operator-trigger', 'Status');
    await handleSelectComboboxText('input-select-trigger', 'Active');
    fireEvent.click(screen.getByText('common_criteria_adder_submit_label'));
    expect(onAddFilter).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'status', value: 'active' }),
      expect.objectContaining({ id: 'status' }),
    );
  });

  it('calls onAddFilter with numeric value', async () => {
    render(
      <DataTableDefaultFilterButton
        columns={columns}
        onAddFilter={onAddFilter}
      />,
    );
    act(() => {
      const trigger = screen.getByTestId('open-filter-menu-button');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await handleSelectComboboxText('select-operator-trigger', 'Count');
    const input = screen.getByLabelText('common_criteria_adder_value_label');
    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.click(screen.getByText('common_criteria_adder_submit_label'));
    expect(onAddFilter).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'count', value: '42' }),
      expect.objectContaining({ id: 'count' }),
    );
  });

  it('calls onAddFilter with date value', async () => {
    render(
      <DataTableDefaultFilterButton
        columns={columns}
        onAddFilter={onAddFilter}
      />,
    );
    act(() => {
      const trigger = screen.getByTestId('open-filter-menu-button');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await handleSelectComboboxText('select-operator-trigger', 'Date');
    fireEvent.click(screen.getByText('common_criteria_adder_submit_label'));
    expect(onAddFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'date',
        comparator: FilterComparator.IsBefore,
        value: expect.any(String),
      }),
      expect.objectContaining({ id: 'date' }),
    );
  });
});
