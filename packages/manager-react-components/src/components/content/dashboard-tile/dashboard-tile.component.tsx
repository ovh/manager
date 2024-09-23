import React from 'react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsDivider,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
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
  <OsdsTile className="w-full flex-col" inline rounded>
    <div className="flex flex-col w-full">
      {title && (
        <>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {title}
          </OsdsText>
          <OsdsDivider separator />
        </>
      )}
      {items.map(({ id, label, value }) => (
        <TileBlock key={id} label={label}>
          {value}
        </TileBlock>
      ))}
    </div>
  </OsdsTile>
);
