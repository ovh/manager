import React, { useEffect, useState } from 'react';
import { Tile } from '@ovh-ux/manager-themes';

export default function DashboardTile({ tile }: any): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // const loadingPromise = tile.onLoad ? tile.onLoad() : Promise.resolve(true);
    // loadingPromise.then(() => {}).finally(() => setIsLoading(false));
  }, []);

  return <Tile title={tile.heading} />;
}
