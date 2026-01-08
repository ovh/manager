import React from 'react';

import { Text } from '@ovhcloud/ods-react';

type TileTextProps = {
  value: string;
};

/**
 * @deprecated
 */
export const TileValue: React.FC<TileTextProps> = ({ value }) => {
  return <Text preset="span">{value}</Text>;
};
