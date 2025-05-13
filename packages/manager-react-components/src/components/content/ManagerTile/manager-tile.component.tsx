import React from 'react';
import { OdsDivider, OdsCard, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
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
  return <OdsText preset={ODS_TEXT_PRESET.heading4}>{children}</OdsText>;
};

const ManagerTileDivider = () => <OdsDivider spacing="24" />;

ManagerTile.Title = ManagerTileTitle;
ManagerTile.Item = ManagerTileItem;
ManagerTile.Divider = ManagerTileDivider;
