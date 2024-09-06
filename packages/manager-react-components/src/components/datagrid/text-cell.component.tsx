import React from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

/** Simple datagrid cell text formatter applying ODS style */
export function DataGridTextCell({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { t } = useTranslation('datagrid');
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={
        children
          ? ODS_THEME_TYPOGRAPHY_SIZE._600
          : ODS_THEME_TYPOGRAPHY_SIZE._300
      }
      color={ODS_THEME_COLOR_INTENT.text}
      className={className}
    >
      {children ?? t('common_empty_text_cell')}
    </OsdsText>
  );
}

export default DataGridTextCell;
