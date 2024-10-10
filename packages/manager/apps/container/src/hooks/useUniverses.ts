import { useQuery } from '@tanstack/react-query';

export type Universe = {
  isPrimary: boolean;
  universe: string;
  url: string;
  external?: boolean;
};

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
  const { data: universes, isLoading } = useQuery({
    queryKey: ["universes"],
    queryFn: fetchUniverses
  })


  return {
    getUniverses: (): Universe[] => universes ?? [],
    isLoading: () => isLoading,
    getHubUniverse: () => {
      return universes?.find(({ universe }) => universe === 'hub');
    },
  };
}

export default useUniverses;
