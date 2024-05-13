import React from 'react';
import { OsdsClipboard, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

type DataGridClipboardCellProps = {
  text: string;
};

/** Simple datagrid cell clipboard text formatter applying ODS style */
export function DataGridClipboardCell({
  text,
}: Readonly<DataGridClipboardCellProps>) {
  const { t } = useTranslation('datagrid');
  return (
    <OsdsClipboard value={text}>
      <span slot="success-message">
        <OsdsText color={ODS_THEME_COLOR_INTENT.success}>
          {t('common_clipboard_success_label')}
        </OsdsText>
      </span>
      <span slot="error-message">
        <OsdsText color={ODS_THEME_COLOR_INTENT.error}>
          {t('common_clipboard_error_label')}
        </OsdsText>
      </span>
    </OsdsClipboard>
  );
}

export default DataGridClipboardCell;
