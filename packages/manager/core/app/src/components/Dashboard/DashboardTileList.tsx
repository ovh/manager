import React from 'react';
import { TileSection } from '@ovh-ux/manager-themes';

export default function DashboardTileList({ items, data }: any): JSX.Element {
  return (
    <>
      {items.map((item: any) => {
        return (
          <TileSection
            key={item.name}
            title={item.title}
            description={item.getDescription(data) || ''}
          ></TileSection>
        );
      })}
    </>
  );
}
