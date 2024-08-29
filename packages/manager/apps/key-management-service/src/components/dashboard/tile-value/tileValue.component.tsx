import React from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type TileTextProps = {
  value: string;
  isText?: boolean;
};

export const TileValue: React.FC<TileTextProps> = ({ value }) => {
  return (
    <OsdsText
      size={ODS_TEXT_SIZE._400}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.default}
    >
      {value}
    </OsdsText>
  );
};
