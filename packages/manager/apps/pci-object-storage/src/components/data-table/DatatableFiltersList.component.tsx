import { Badge, Button } from '@datatr-ux/uxlib';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import './translations';
import { useLocale } from '@/hooks/useLocale';
import { useDataTableContext } from './DataTable.context';

export declare enum FilterComparator {
  Includes = 'includes',
  StartsWith = 'starts_with',
  EndsWith = 'ends_with',
  IsEqual = 'is_equal',
  IsDifferent = 'is_different',
  IsLower = 'is_lower',
  IsHigher = 'is_higher',
  IsBefore = 'is_before',
  IsAfter = 'is_after',
  IsIn = 'is_in',
}

export type Filter = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
};

export type FilterWithLabel = Filter & { label: string };

export type FilterListProps = {
  filters: FilterWithLabel[];
  onRemoveFilter: (filter: FilterWithLabel) => void;
};

export function DatatableFiltersList() {
  const { t } = useTranslation('filters');
  const { columnFilters } = useDataTableContext();
  const locale = useLocale();
  const formater = useMemo(
    () => new Intl.DateTimeFormat(locale.replace('_', '-')),
    [locale],
  );
  const tComp = (comparator: string) =>
    t(`common_criteria_adder_operator_${comparator}`);

  const isValidDate = (value: string): boolean => {
    // Reject purely numerical strings
    if (!Number.isNaN(Number(value))) {
      return false;
    }
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  };
  const getFilterContent = (filter: FilterWithLabel) => {
    const label = `${
      filter.label ? `${filter.label} ${tComp(filter.comparator)} ` : ''
    }`;
    let formattedValue;
    if (Array.isArray(filter.value)) {
      // Handle array values
      formattedValue = filter.value.join(', ');
    } else if (typeof filter.value === 'string' && isValidDate(filter.value)) {
      // Format valid date strings
      formattedValue = formater.format(new Date(filter.value));
    } else {
      // Fallback for other types of strings or invalid dates
      formattedValue = filter.value;
    }
    return `${label}${formattedValue}`;
  };

  if (!columnFilters?.filters.length) return <></>;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {columnFilters.filters?.map((filter, key) => (
        <Badge variant="primary" className="py-0.5" key={key}>
          <span>{getFilterContent(filter)}</span>
          <Button
            mode="ghost"
            className="ml-2 p-0 size-4"
            onClick={() => columnFilters.removeFilter(filter)}
          >
            <X className="size-4 text-white hover:text-primary" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
