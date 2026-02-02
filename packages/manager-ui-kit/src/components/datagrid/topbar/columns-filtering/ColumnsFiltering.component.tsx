import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_NAME,
  Icon,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { Button } from '@/components/button/Button.component';
import { FilterProps } from '@/components/filters/Filter.props';
import { ColumnFilter } from '@/components/filters/filter-add/FilterAdd.props';
import { FilterAdd } from '@/components/filters/filter-add/Filteradd.component';

interface ColumnsFilteringComponentProps {
  columns: ColumnFilter[];
  filters?: FilterProps;
  resourceType?: string;
}

export const ColumnsFilteringComponent = ({
  columns,
  filters,
  resourceType,
}: ColumnsFilteringComponentProps) => {
  const { t } = useTranslation('filters');
  return (
    <Popover position={POPOVER_POSITION.bottom}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t('common_criteria_adder_filter_label')}
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.ghost}
        >
          <>
            <Icon name={ICON_NAME.filter} />
            {t('common_criteria_adder_filter_label')}
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent createPortal={false} className="min-w-[320px] box-border">
        <FilterAdd
          columns={columns}
          resourceType={resourceType}
          onAddFilter={(addedFilter, column) => {
            if (filters && addedFilter.value !== undefined) {
              filters.add({
                ...addedFilter,
                value: addedFilter.value,
                label: column.label,
              });
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
