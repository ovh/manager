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

import { Button } from '../../../button/Button.component';
import { ColumnFilter, FilterAdd } from '../../../filters';
import { FilterProps } from '../../Datagrid.props';

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
      <PopoverContent createPortal={false}>
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
