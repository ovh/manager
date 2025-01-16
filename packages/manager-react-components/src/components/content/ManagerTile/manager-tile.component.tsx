import React from 'react';
import { OdsDivider, OdsCard } from '@ovhcloud/ods-components/react';
import { ODS_CARD_COLOR } from '@ovhcloud/ods-components';
import { ManagerTileItem } from './manager-tile-item.component';

export type ManagerTileProps = React.ComponentProps<typeof OdsCard>;

export const ManagerTile = ({
  className,
  children,
  ...props
}: ManagerTileProps) => {
  return (
    <OdsCard
      className={`w-full flex-col p-[1rem] ${className}`}
      color={ODS_CARD_COLOR.neutral}
      {...props}
    >
      <div className="flex flex-col w-full">{children}</div>
    </OdsCard>
  );
};

type ManagerTileTitleProps = React.PropsWithChildren;
const ManagerTileTitle = ({ children }: ManagerTileTitleProps) => {
  return (
    <h4 className="dashboard-tile-title m-0 text-[--ods-color-heading] text-[20px] leading-[28px] font-bold">
      {children}
    </h4>
  );
};

const ManagerTileDivider = () => <OdsDivider spacing="24" />;

ManagerTile.Title = ManagerTileTitle;
ManagerTile.Item = ManagerTileItem;
ManagerTile.Divider = ManagerTileDivider;
