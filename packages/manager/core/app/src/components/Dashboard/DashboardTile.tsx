import React, { useEffect, useState } from 'react';
import { Tile } from '@ovh-ux/manager-themes';

import { tileTypesEnum } from '.';
import DashboardTileLoading from './DashboardTileLoading';
import DashboardTileList from './DashboardTileList';

export default function DashboardTile({ tile }: any): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  const getTileContentComponent = () => {
    switch (tile.type) {
      case tileTypesEnum.LIST:
        return <DashboardTileList data={data} items={tile.listItems} />;
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
