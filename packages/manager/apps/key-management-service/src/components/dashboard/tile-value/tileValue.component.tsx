import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

type TileTextProps = {
  value: string;
};

/**
 * @deprecated
 */
export const TileValue: React.FC<TileTextProps> = ({ value }) => {
  return <OdsText preset={ODS_TEXT_PRESET.span}>{value}</OdsText>;
};
