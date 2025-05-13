import React from 'react';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type OdsIconWrapperType = {
  name: ODS_ICON_NAME;
};

const OdsIconWrapper = ({ name }: OdsIconWrapperType) => (
  <OsdsIcon
    hoverable
    name={name}
    size={ODS_ICON_SIZE.lg}
    color={ODS_THEME_COLOR_INTENT.primary}
  />
);

export default OdsIconWrapper;
