import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Icon,
  ICON_NAME,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  POPOVER_POSITION,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../button/Button.component';
import { ColumnFilter, FilterAdd } from '../../../filters/filter-add.component';
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
      <PopoverContent>
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
