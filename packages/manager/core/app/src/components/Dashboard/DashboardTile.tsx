import React, { useEffect, useState } from 'react';
import { Tile } from '@ovh-ux/manager-themes';
import { isFunction } from 'lodash-es';

import {
  TileTypesEnum,
  DashboardTile as DashboardTileType,
  DashboardTileDefinition,
} from '.';
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
  const [definitions, setDefinitions] = useState<DashboardTileDefinition[]>();

  const getTileContentComponent = () => {
    switch (tile.type) {
      case TileTypesEnum.LIST:
        return <DashboardTileList data={data} definitions={definitions} />;
      default:
        return tile.content;
    }
  };

  useEffect(() => {
    const loadingPromise = tile.onLoad ? tile.onLoad() : Promise.resolve(true);
    loadingPromise
      .then((response) => {
        setData(response);
        setDefinitions(
          isFunction(tile.definitions)
            ? tile.definitions(response)
            : tile.definitions,
        );
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
