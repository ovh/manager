import React, { FunctionComponent } from 'react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';

export const InformationIcon: FunctionComponent = () => (
  <div className="rounded-full p-4 bg-[#bef1ff]">
    <OsdsIcon
      size={ODS_ICON_SIZE.xl}
      className="block"
      color={ODS_THEME_COLOR_INTENT.text}
      name={ODS_ICON_NAME.INFO_CIRCLE}
    ></OsdsIcon>
  </div>
);
