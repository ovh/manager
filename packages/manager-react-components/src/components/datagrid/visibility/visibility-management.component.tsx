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
};

export function VisibilityManagement({
  columnsVisibility,
}: Readonly<ColumnsVisibilityProps>) {
  const { t } = useTranslation('datagrid');
  const visibilityPopoverRef = useRef(null);
  const columnsIncludedInCounter = columnsVisibility.filter(
    (column) => !['expander'].includes(column.id) && column.label !== '',
  );

  const columnsVisibilityState = columnsIncludedInCounter.reduce(
    (acc, current) => {
      if (current.isVisible()) {
        acc.enabled += 1;
      }
      acc.haveToDisplay = acc.enabled < acc.total;
      return acc;
    },
    {
      enabled: 0,
      total: columnsIncludedInCounter.length,
      haveToDisplay: false,
    },
  );

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
        label={`${t('common_topbar_columns')} ${
          columnsVisibilityState.haveToDisplay
            ? `(${columnsVisibilityState.enabled})`
            : ''
        }`}
      />
      <OdsPopover
        ref={visibilityPopoverRef}
        triggerId="datagrid-visibility-popover-trigger"
        with-arrow
      >
        <div className="flex flex-col">
          {columnsIncludedInCounter.map((column) => (
            <OdsFormField key={column.id}>
              <div className="flex flex-row items-center gap-x-2">
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
