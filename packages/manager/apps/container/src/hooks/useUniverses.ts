import { useEffect, useState } from 'react';
import { find } from 'lodash-es';

export type Universe = {
  isPrimary: boolean;
  universe: string;
  url: string;
  external?: boolean;
};

// const SECONDARY_UNIVERSES: string[] = [];

export async function fetchUniverses(): Promise<Universe[]> {
  return fetch('/engine/2api/universes?version=beta', {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
    .then((response) => response.json())
    .then((universes) =>
      universes.map((universe: Universe) => ({
        isPrimary: true, //! SECONDARY_UNIVERSES.includes(universe.universe),
        universe: universe.universe,
        url: universe.url,
      })),
    );
}

export function useUniverses() {
  const [universes, setUniverses] = useState<Universe[]>([]);

  useEffect(() => {
    fetchUniverses().then(setUniverses);
  }, []);

  return {
    getUniverses: (): Universe[] => universes,
    isLoading: () => !universes?.length,
    getHubUniverse: () => {
      return find(universes, { universe: 'hub' });
    },
  };
}

export default useUniverses;
