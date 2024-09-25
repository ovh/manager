import React from 'react';
import { OdsDivider, OdsCard } from '@ovhcloud/ods-components/react';
import { TileBlock } from './tile-block.component';

export type DashboardTileBlockItem = {
  id: string;
  label?: string;
  value: React.ReactNode;
};

export type DashboardTileProps = {
  title?: string;
  items: DashboardTileBlockItem[];
};

export const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  items,
}) => (
  <OdsCard className="w-full flex-col p-[1rem]" color="neutral">
    <div className="flex flex-col w-full">
      {title && (
        <>
          <h4 className="dashboard-tile-title m-0 text-[--ods-color-heading] text-[20px] leading-[28px] font-bold">
            {title}
          </h4>
          <OdsDivider spacing="24" />
        </>
      )}
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <TileBlock key={item.id} label={item.label}>
            {item.value}
          </TileBlock>
          {index < items.length - 1 && <OdsDivider spacing="24" />}
        </React.Fragment>
      ))}
    </div>
  </OdsCard>
);
