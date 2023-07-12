import React from 'react';
import { OsdsIcon } from '@ovhcloud/ods-stencil/components/react/';
import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

type OdsIconWrapperType = {
  name: OdsIconName;
};

const OdsIconWrapper = ({ name }: OdsIconWrapperType) => (
  <OsdsIcon
    hoverable
    name={name}
    size={OdsIconSize.lg}
    color={OdsThemeColorIntent.primary}
  />
);

export default OdsIconWrapper;
