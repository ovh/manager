import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import DashboardTile from './DashboardTile';

export default function Dashboard({ tiles }: any): JSX.Element {
  return (
    <SimpleGrid columns={3} spacingX={5} spacingY={3}>
      {tiles.map((tile: any) => {
        return <DashboardTile key={tile.name} tile={tile} />;
      })}
    </SimpleGrid>
  );
}
