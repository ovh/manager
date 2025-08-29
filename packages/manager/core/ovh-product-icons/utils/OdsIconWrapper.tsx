import React from 'react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';

type OdsIconWrapperType = {
  name: ODS_ICON_NAME;
};

const OdsIconWrapper = ({ name }: OdsIconWrapperType) => (
  <OsdsIcon hoverable name={name} size={ODS_ICON_SIZE.lg} color={ODS_THEME_COLOR_INTENT.primary} />
);

export default OdsIconWrapper;
