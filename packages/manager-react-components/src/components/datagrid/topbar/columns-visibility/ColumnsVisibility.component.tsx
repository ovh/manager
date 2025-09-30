import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Icon,
  ICON_NAME,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  POPOVER_POSITION,
} from '@ovhcloud/ods-react';
import { ColumnsVisibilityProps } from './ColumnsVisiblity.props';
import { Button } from '../../../button/Button.component';
import { Text } from '../../../text/Text.component';

export const INTERNAL_COLUMNS = ['expander', 'actions'];

const ColumnsVisibilityComponent = <T,>({
  getIsAllColumnsVisible,
  toggleAllColumnsVisible,
  visibleColumns,
}: ColumnsVisibilityProps<T>) => {
  const { t } = useTranslation('datagrid');
  const eligibleColumns = visibleColumns.filter(
    (column) => !INTERNAL_COLUMNS.includes(column.id),
  );
  const visibleColumnsCount = eligibleColumns.filter((column) =>
    column.getIsVisible(),
  ).length;
  const isAllColumnsVisible = getIsAllColumnsVisible();
  return (
    <div>
      <Popover position={POPOVER_POSITION.bottom}>
        <PopoverTrigger asChild>
          <Button
            aria-label={t('common_topbar_columns')}
            size={BUTTON_SIZE.sm}
            variant={BUTTON_VARIANT.ghost}
          >
            <>
              <Icon name={ICON_NAME.columns} />
              {`${t('common_topbar_columns')}${
                visibleColumnsCount < eligibleColumns.length
                  ? ` (${visibleColumnsCount})`
                  : ''
              }`}
            </>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col">
            <div className="pr-5 flex flex-row items-center gap-x-2">
              <Checkbox
                aria-label={t('common_topbar_columns_select_all')}
                checked={isAllColumnsVisible}
                onChange={() => toggleAllColumnsVisible()}
              >
                <CheckboxControl />
                <CheckboxLabel>
                  <Text>{t('common_topbar_columns_select_all')}</Text>
                </CheckboxLabel>
              </Checkbox>
            </div>
            {eligibleColumns.map((column) => (
              <FormField key={column.id}>
                <div className="px-7 py-1 flex flex-row items-center gap-x-2">
                  <Checkbox
                    name={column.id}
                    id={column.id}
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    disabled={!column.getCanHide()}
                  >
                    <CheckboxControl />
                    <CheckboxLabel>
                      <Text>{column.columnDef.header as string}</Text>
                    </CheckboxLabel>
                  </Checkbox>
                </div>
              </FormField>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const ColumnVisibility = memo(ColumnsVisibilityComponent) as <T>(
  props: ColumnsVisibilityProps<T>,
) => JSX.Element;
