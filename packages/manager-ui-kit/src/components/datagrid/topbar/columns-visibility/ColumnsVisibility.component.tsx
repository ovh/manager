import { JSX, memo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  ICON_NAME,
  Icon,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';

import { Button } from '../../../button/Button.component';
import { Text } from '../../../text/Text.component';
import { ColumnsVisibilityProps } from './ColumnsVisiblity.props';

export const INTERNAL_COLUMNS = ['expander', 'actions', 'row-selection'];

const ColumnsVisibilityComponent = <T,>({
  getIsAllColumnsVisible,
  toggleAllColumnsVisible,
  visibleColumns,
}: ColumnsVisibilityProps<T>) => {
  const { t } = useTranslation('datagrid');
  const eligibleColumns =
    visibleColumns?.filter((column) => !INTERNAL_COLUMNS.includes(column.id)) || [];
  const visibleColumnsCount = eligibleColumns.filter((column) => column.getIsVisible()).length;
  const isAllColumnsVisible = getIsAllColumnsVisible?.() || false;
  return (
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
              visibleColumnsCount < eligibleColumns.length ? ` (${visibleColumnsCount})` : ''
            }`}
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col">
          <FormField>
            <ul className="list-none px-[10px] py-0 m-0">
              <li>
                <Checkbox
                  aria-label={t('common_topbar_columns_select_all')}
                  checked={isAllColumnsVisible}
                  onChange={() => toggleAllColumnsVisible?.()}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text>{t('common_topbar_columns_select_all')}</Text>
                  </CheckboxLabel>
                </Checkbox>
              </li>
              {eligibleColumns.map((column) => (
                <li key={column.id} className="pl-[20px] pt-[5px]">
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
                </li>
              ))}
            </ul>
          </FormField>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ColumnVisibility = memo(ColumnsVisibilityComponent) as <T>(
  props: ColumnsVisibilityProps<T>,
) => JSX.Element;
