import { useTranslation } from 'react-i18next';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import {
  Input,
  Label,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import './translations';
import FormattedDate from '../formatted-date/FormattedDate.component';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { Filter, FilterCategories, FilterComparator } from '@/lib/filters';

export type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
  options?: { label: string | ReactNode; value: string }[];
};

export type DataTableDefaultFilterButtonProps = {
  columns: ColumnFilter[];
  onAddFilter: (filter: Filter, column: ColumnFilter) => void;
};
const DataTableDefaultFilterButton = ({
  columns,
  onAddFilter,
}: DataTableDefaultFilterButtonProps) => {
  const { t } = useTranslation('filters');
  const dateLocale = useDateFnsLocale();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedId, setSelectedId] = useState(columns?.[0]?.id || '');
  const [selectedComparator, setSelectedComparator] = useState(
    columns?.[0]?.comparators?.[0] || FilterComparator.IsEqual,
  );
  const [value, setValue] = useState('');
  const [dateValue, setDateValue] = useState(new Date());

  const selectedColumn = useMemo(
    () => columns.find(({ id }) => selectedId === id),
    [columns, selectedId],
  );

  useEffect(() => {
    if (!selectedColumn.comparators.includes(selectedComparator)) {
      setSelectedComparator(selectedColumn.comparators[0]);
    }
  }, [selectedColumn]);

  const isInputDate = selectedColumn?.comparators === FilterCategories.Date;
  const isInputNumeric =
    selectedColumn?.comparators === FilterCategories.Numeric;
  const isInputSelect =
    selectedColumn?.comparators === FilterCategories.Options &&
    selectedColumn?.options?.length > 0;
  const isInputString =
    selectedColumn?.comparators === FilterCategories.String && !isInputSelect;

  const submitAddFilter = () => {
    onAddFilter(
      {
        key: selectedId,
        comparator: selectedComparator,
        value: isInputDate ? dateValue.toString() : value,
      },
      selectedColumn,
    );
    setValue('');
    setDateValue(new Date());
    setFiltersOpen(false);
    setSelectedId(columns[0].id);
  };

  return (
    <DropdownMenu open={filtersOpen} onOpenChange={setFiltersOpen}>
      <DropdownMenuTrigger asChild>
        <Button mode="outline">
          <FilterIcon className="size-4 md:mr-1" />
          <span className="hidden md:block">
            {t('common_criteria_adder_filter_label')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <div>
          <Label>{t('common_criteria_adder_column_label')}</Label>
          <Select
            name="add-operator"
            value={selectedId}
            onValueChange={(column) => {
              setSelectedId(column);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a criteria" />
            </SelectTrigger>
            <SelectContent>
              {columns.map(({ id, label }) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t('common_criteria_adder_operator_label')}</Label>
          <Select
            name="add-operator"
            value={selectedComparator}
            onValueChange={(operator: FilterComparator) => {
              setSelectedComparator(operator);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a criteria" />
            </SelectTrigger>
            <SelectContent>
              {selectedColumn?.comparators?.map((comp) => (
                <SelectItem key={comp} value={comp}>
                  {t(`${'common_criteria_adder_operator_'}${comp}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="input-value">
            {t('common_criteria_adder_value_label')}
          </Label>
          {isInputDate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  mode={'ghost'}
                  className="text-left justify-start flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <FormattedDate
                    date={dateValue}
                    options={{
                      dateStyle: 'medium',
                    }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(day) => setDateValue(day)}
                  locale={dateLocale}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
          {isInputSelect && (
            <Select
              name="value"
              value={value}
              onValueChange={(option) => {
                setValue(option);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedColumn?.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {isInputString && (
            <Input
              id="input-value"
              value={value}
              onChange={(e) => setValue(`${e.target.value}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitAddFilter();
                }
              }}
            />
          )}
          {isInputNumeric && (
            <Input
              id="input-value"
              type="number"
              value={value}
              onChange={(e) => setValue(`${e.target.value}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitAddFilter();
                }
              }}
            />
          )}
        </div>
        <div>
          <Button className="w-full mt-2" onClick={submitAddFilter}>
            {t('common_criteria_adder_submit_label')}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableDefaultFilterButton;
