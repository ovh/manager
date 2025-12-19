import { useQuery } from '@tanstack/react-query';
import { getLogoutUrl } from '@ovh-ux/manager-core-sso';

export type Universe = {
  isPrimary: boolean;
  universe: string;
  url: string;
  external?: boolean;
};

const oldDomains = {
  EU: 'www.ovh.com/manager',
  CA: 'ca.ovh.com/manager',
  US: 'us.ovhcloud.com/manager',
  TELECOM: 'www.ovhtelecom.fr/manager',
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
        url: universe.universe === 'sunrise' || window.location.pathname?.includes('/manager/') ? universe.url : universe.url.replace(oldDomains.EU, 'manager.eu.ovhcloud.com').replace(oldDomains.CA, 'manager.ca.ovhcloud.com').replace(oldDomains.US, 'manager.us.ovhcloud.com').replace(oldDomains.TELECOM, 'manager.eu.ovhcloud.com'),
      })),
    );
}

export function useUniverses() {
  const { data: universes, isLoading } = useQuery({
    queryKey: ['universes'],
    queryFn: fetchUniverses,
  });

  return {
    getUniverses: (): Universe[] => universes ?? [],
    isLoading: () => isLoading,
    getHubUniverse: () => {
      return universes?.find(({ universe }) => universe === 'hub');
    },
  };
}

export default useUniverses;
