import React, { ReactNode } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

/** Simple datagrid cell text formatter applying ODS style */
export function DataGridTextCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
      className={className}
    >
      {children}
    </OsdsText>
  );
}

export default DataGridTextCell;
