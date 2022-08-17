import React, { useEffect, useState } from 'react';
import { Tile } from '@ovh-ux/manager-themes';

import { TileTypesEnum, DashboardTile as DashboardTileType } from '.';
import DashboardTileLoading from './DashboardTileLoading';
import DashboardTileList from './DashboardTileList';

export type DashboardTileProps = {
  tile: DashboardTileType;
};

export default function DashboardTile({
  tile,
}: DashboardTileProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<unknown>();

  const getTileContentComponent = () => {
    switch (tile.type) {
      case TileTypesEnum.LIST:
        return <DashboardTileList data={data} definitions={tile.definitions} />;
      default:
        return tile.content;
    }
  };

  useEffect(() => {
    const loadingPromise = tile.onLoad ? tile.onLoad() : Promise.resolve(true);
    loadingPromise
      .then((response) => {
        setData(response);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Tile title={tile.heading}>
      {isLoading && <DashboardTileLoading />}
      {!isLoading && getTileContentComponent()}
    </Tile>
  );
}
