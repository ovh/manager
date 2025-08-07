import { PropsWithChildren } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

export const ErrorText = ({ children }: PropsWithChildren) => {
  return (
    <OsdsText
      color={ODS_THEME_COLOR_INTENT.error}
      size={ODS_TEXT_SIZE._100}
      level={ODS_TEXT_LEVEL.body}
      hue={ODS_TEXT_COLOR_HUE._500}
    >
      {children}
    </OsdsText>
  );
};
