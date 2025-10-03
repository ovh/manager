import React from 'react';
import { OdsClipboard, OdsText } from '@ovhcloud/ods-components/react';
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
    <OdsClipboard value={text}>
      <span slot="success-message">
        <OdsText>{t('common_clipboard_success_label')}</OdsText>
      </span>
      <span slot="error-message">
        <OdsText>{t('common_clipboard_error_label')}</OdsText>
      </span>
    </OdsClipboard>
  );
}

export default DataGridClipboardCell;
