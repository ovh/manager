import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsFormField,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERNAL_COLUMNS } from '../datagrid.constants';

export type ColumnsVisibility = {
  id: string;
  isDisabled: boolean;
  label: string;
  enableHiding: boolean;
  isVisible: () => boolean;
  onChange: () => void;
};

export type ColumnsVisibilityProps = {
  columnsVisibility: ColumnsVisibility[];
  toggleAllColumnsVisible: (a: boolean) => void;
  getIsAllColumnsVisible: () => boolean;
  getIsSomeColumnsVisible: () => boolean;
};

export function VisibilityManagement({
  columnsVisibility,
  toggleAllColumnsVisible,
  getIsAllColumnsVisible,
  getIsSomeColumnsVisible,
}: Readonly<ColumnsVisibilityProps>) {
  const { t } = useTranslation('datagrid');
  const visibilityPopoverRef = useRef(null);
  const eligibleColumns = columnsVisibility.filter(
    (column) => !INTERNAL_COLUMNS.includes(column.id) && column.label !== '',
  );

  const visibleColumnsCount = eligibleColumns.filter((column) =>
    column.isVisible(),
  ).length;

  const isAllColumnsVisible = getIsAllColumnsVisible();
  const isSomeColumnsVisible = getIsSomeColumnsVisible();

  return (
    <>
      <OdsButton
        id="datagrid-visibility-popover-trigger"
        slot="datagrid-visibility-popover-trigger"
        data-testid="datagrid-topbar-visibility-button"
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.outline}
        icon={ODS_ICON_NAME.columns}
        aria-label={t('common_topbar_columns')}
        label={`${t('common_topbar_columns')}${
          visibleColumnsCount < eligibleColumns.length
            ? ` (${visibleColumnsCount})`
            : ''
        }`}
      />
      <OdsPopover
        ref={visibilityPopoverRef}
        triggerId="datagrid-visibility-popover-trigger"
        with-arrow
      >
        <div className="flex flex-col">
          <div className="pr-5 flex flex-row items-center gap-x-2">
            <OdsCheckbox
              name={'toggle-all-columns-visibility'}
              inputId={'toggle-all-columns-visibility'}
              isChecked={isAllColumnsVisible}
              onOdsChange={() => toggleAllColumnsVisible(!isAllColumnsVisible)}
              ariaLabel={t('common_topbar_columns_select_all')}
              isIndeterminate={!isAllColumnsVisible && isSomeColumnsVisible}
            />
            <label slot="label" htmlFor={'toggle-all-columns-visibility'}>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('common_topbar_columns_select_all')}
              </OdsText>
            </label>
          </div>
          {eligibleColumns.map((column) => (
            <OdsFormField key={column.id}>
              <div className="px-5 flex flex-row items-center gap-x-2">
                <OdsCheckbox
                  name={column.id}
                  inputId={column.id}
                  isDisabled={column.isDisabled}
                  isChecked={column.isVisible()}
                  onOdsChange={column.onChange}
                  ariaLabel={column.label}
                />
                <label slot="label" htmlFor={column.id}>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {column.label}
                  </OdsText>
                </label>
              </div>
            </OdsFormField>
          ))}
        </div>
      </OdsPopover>
    </>
  );
}
