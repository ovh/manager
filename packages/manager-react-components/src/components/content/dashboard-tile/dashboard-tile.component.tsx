import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsDivider, OdsText, OdsCard } from '@ovhcloud/ods-components/react';
import { TileBlock } from './tile-block.component';
import './dashboard-tile.scss';

export type DashboardTileBlockItem = {
  id: string;
  label: string;
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
  <OdsCard className="w-full h-full flex-col px-[1rem] py-[0.5rem]">
    <div className="flex flex-col w-full">
      {title && (
        <>
          <OdsText
            className="dashboard-tile-title"
            preset={ODS_TEXT_PRESET.heading5}
          >
            {title}
          </OdsText>
          <OdsDivider />
        </>
      )}
      {items.map((item, index) => (
        <>
          <TileBlock key={item.id} label={item.label}>
            {item.value}
          </TileBlock>
          {index < items.length - 1 && <OdsDivider />}
        </>
      ))}
    </div>
  </OdsCard>
);
