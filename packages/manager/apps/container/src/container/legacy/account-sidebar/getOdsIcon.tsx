import React from "react";
import { OsdsIcon } from '@ovhcloud/ods-components/react'
import { ODS_ICON_NAME,ODS_ICON_SIZE } from '@ovhcloud/ods-components'
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';


const getOdsIcon = (iconName: ODS_ICON_NAME): JSX.Element => {
  return <OsdsIcon name={iconName} color={ODS_THEME_COLOR_INTENT.primary}size={ODS_ICON_SIZE.sm}/>;
}

export default getOdsIcon;

