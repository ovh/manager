import React, { useEffect, useState } from 'react';
import { Tile } from '@ovh-ux/manager-themes';
import { withErrorBoundary } from 'react-error-boundary';

import {
  TileTypesEnum,
  DashboardTile as DashboardTileType,
  DashboardTileDefinition,
} from '.';
import DashboardTileError from './DashboardTileError';
import DashboardTileList from './DashboardTileList';

export type DashboardTileProps = {
  tile: DashboardTileType;
};

function DashboardTile({ tile }: DashboardTileProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingInError, setLoadingInError] = useState(false);
  const [loadingError, setLoadingError] = useState<string>();
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
          typeof tile.definitions === 'function'
            ? tile.definitions(response)
            : tile.definitions,
        );
      })
      .catch((error) => {
        setData({});
        setDefinitions([]);
        setLoadingInError(true);
        setLoadingError(tile.onError?.(error) || '');
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (loadingInError) {
    throw new Error(loadingError);
  }

  return (
    <Tile title={tile.heading} isLoading={isLoading}>
      {!isLoading && getTileContentComponent()}
    </Tile>
  );
}

export default withErrorBoundary(DashboardTile, {
  FallbackComponent: DashboardTileError,
  resetKeys: ['loadingError'],
});
