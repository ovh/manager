import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import DashboardTileComponent from './DashboardTile';
import { DashboardTile } from '.';

export type DashboardProps = {
  tiles: DashboardTile[];
};

export default function Dashboard({ tiles }: DashboardProps): JSX.Element {
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacingX={5} spacingY={3}>
      {tiles.map((tile: DashboardTile) => {
        return <DashboardTileComponent key={tile.name} tile={tile} />;
      })}
    </SimpleGrid>
  );
}
