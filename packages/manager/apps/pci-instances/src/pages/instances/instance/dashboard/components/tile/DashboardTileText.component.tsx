import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import {
  DashboardTileBlock,
  TDashboardTileProps,
} from './DashboardTile.component';

export const DashboardTileText: FC<TDashboardTileProps> = ({
  children,
  ...props
}) => (
  <DashboardTileBlock {...props}>
    <Text>{children}</Text>
  </DashboardTileBlock>
);
