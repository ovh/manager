import React from 'react';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { FilterWithLabel } from './interface';
import './translations';

export type FilterListProps = {
  filters: FilterWithLabel[];
  onRemoveFilter: (filter: FilterWithLabel) => void;
};

export function FilterList({
  filters,
  onRemoveFilter,
}: Readonly<FilterListProps>) {
  const { t } = useTranslation('filters');
  const tComp = (comparator: string) =>
    t(`common_criteria_adder_operator_${comparator}`);

  return (
    <>
      {filters?.map((filter, key) => (
        <OsdsChip
          className="m-3"
          color={ODS_THEME_COLOR_INTENT.primary}
          key={key}
          inline={true}
          removable={true}
          onOdsChipRemoval={() => onRemoveFilter(filter)}
          data-testid="filter-list_chip_item"
        >
          {filter.label ? `${filter.label} ${tComp(filter.comparator)} ` : ''}
          {filter.value}
        </OsdsChip>
      ))}
    </>
  );
}
