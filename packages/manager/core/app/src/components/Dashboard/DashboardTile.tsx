import React from 'react';
import { Tile } from '@ovh-ux/manager-themes';
import { withErrorBoundary } from 'react-error-boundary';

import { TileTypesEnum, DashboardTile as DashboardTileType } from '.';
import DashboardTileError from './DashboardTileError';
import DashboardTileList from './DashboardTileList';

export type DashboardTileProps = {
  tile: DashboardTileType;
};

function DashboardTile({ tile }: DashboardTileProps): JSX.Element {
  const loadingQueries = tile?.loadingQueries || {};
  const tileIsLoading = Object.values(loadingQueries).some(({ isLoading }) => {
    return isLoading;
  });
  const loadingInError = Object.values(loadingQueries).some(({ isError }) => {
    return isError;
  });

  if (tileIsLoading) {
    return <Tile title={tile.heading} isLoading={tileIsLoading}></Tile>;
  }

  if (loadingInError) {
    // find the error and throw it
    const { error } = Object.values(loadingQueries).find(({ isError }) => {
      return isError;
    });
    throw error;
  }

  // build data
  const data = {} as Record<string, unknown>;
  Object.keys(loadingQueries).forEach((queryKey) => {
    data[queryKey] = loadingQueries[queryKey].data;
  });

  const definitions =
    typeof tile.definitions === 'function'
      ? tile.definitions(data)
      : tile.definitions || [];

  const getTileContentComponent = () => {
    switch (tile.type) {
      case TileTypesEnum.LIST:
        return <DashboardTileList data={data} definitions={definitions} />;
      default:
        return tile.content;
    }
  };

  return <Tile title={tile.heading}>{getTileContentComponent()}</Tile>;
}

export default withErrorBoundary(DashboardTile, {
  FallbackComponent: DashboardTileError,
});
