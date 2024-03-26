import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { FilterWithLabel } from '@/components/useColumnFilters';

export interface FilterListProps {
  filters: FilterWithLabel[];
  onRemoveFilter: (filter: FilterWithLabel) => void;
}

export default function FilterList({
  filters,
  onRemoveFilter,
}: FilterListProps) {
  const { t } = useTranslation('filter');

  return (
    <>
      {filters?.map((filter, key) => (
        <OsdsChip
          color={ODS_THEME_COLOR_INTENT.primary}
          key={key}
          inline={true}
          removable={true}
          onOdsChipRemoval={() => {
            onRemoveFilter(filter);
          }}
          data-testid="filter-list_chip_item"
        >
          {filter.label}{' '}
          {t(`${'common_criteria_adder_operator_'}${filter.comparator}`)}{' '}
          {filter.value}
        </OsdsChip>
      ))}
    </>
  );
}
