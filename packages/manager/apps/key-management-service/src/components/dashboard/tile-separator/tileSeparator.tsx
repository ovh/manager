import React from 'react';
import { ODS_DIVIDER_SIZE } from '@ovhcloud/ods-components';
import { OsdsDivider } from '@ovhcloud/ods-components/react';

export const TileSeparator = () => {
  return <OsdsDivider separator size={ODS_DIVIDER_SIZE.one} />;
};
