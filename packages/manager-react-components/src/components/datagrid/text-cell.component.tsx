import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

type DataGridTextCellProps = {
  className?: string;
  'data-testid'?: string;
};

/** Simple datagrid cell text formatter applying ODS style */
export function DataGridTextCell({
  className,
  children,
  'data-testid': dataTestId,
}: React.PropsWithChildren<DataGridTextCellProps>) {
  const { t } = useTranslation('datagrid');
  return (
    <OdsText preset={ODS_TEXT_PRESET.span} data-testid={dataTestId}>
      {(children as string) ?? t('common_empty_text_cell' as string)}
    </OdsText>
  );
}

export default DataGridTextCell;
