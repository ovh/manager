import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import React, { FunctionComponent } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export const FileInputLabel: FunctionComponent<Props> = ({
  children,
  className,
}) => {
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.text}
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      className={className}
      size={ODS_TEXT_SIZE._500}
    >
      {children}
    </OsdsText>
  );
};
