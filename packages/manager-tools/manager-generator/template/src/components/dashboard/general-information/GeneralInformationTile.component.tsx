import React from 'react';

import { ManagerTile } from '@ovh-ux/muk';

import { GeneralInformationProps } from '@/types/GeneralInfo.type';

export default function GeneralInformationTile({
  tiles,
}: GeneralInformationProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      {tiles.map((tile) => (
        <ManagerTile
          key={tile.title}
          className="w-full h-full flex-col"
          color="primary"
        >
          <ManagerTile.Title>{tile.title}</ManagerTile.Title>
          <ManagerTile.Divider />
          {tile.items.map((item) => (
            <ManagerTile.Item key={item.id}>
              <ManagerTile.Item.Label tooltip={tile.help}>
                {item.label}
              </ManagerTile.Item.Label>
              <ManagerTile.Item.Description>
                {item.value}
              </ManagerTile.Item.Description>
              <br />
            </ManagerTile.Item>
          ))}
        </ManagerTile>
      ))}
    </div>
  );
}
