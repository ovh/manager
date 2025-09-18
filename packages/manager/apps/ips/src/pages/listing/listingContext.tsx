import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { GetIpListParams } from '@/data/api';

export type ListingContextType = {
  apiFilter: GetIpListParams;
  setApiFilter: React.Dispatch<React.SetStateAction<GetIpListParams>>;
  hasNoApiFilter: boolean;
  expiredIps: string[];
  addExpiredIp: (expiredIp: string) => void;
};

export const ListingContext = createContext<ListingContextType>({
  addExpiredIp: () => {},
  apiFilter: {},
  expiredIps: [],
  hasNoApiFilter: true,
  setApiFilter: () => {},
});

function cleanApiFilter(apiFilter: GetIpListParams) {
  const result: Record<string, string> = {};
  Object.entries(apiFilter).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value as string;
    }
  });
  return result;
}

function parseSearchValue(value: string) {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    default:
      return value;
  }
}

function searchToApiFilter(search?: URLSearchParams): GetIpListParams {
  const params: Record<string, string | number | boolean | null> = {};
  search?.forEach?.((value, key) => {
    params[key] =
      key === 'version' ? parseInt(value, 10) : parseSearchValue(value);
  });
  return params as GetIpListParams;
}

export const ListingContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useSearchParams();
  const [expiredIps, setExpiredIps] = useState<string[]>([]);
  const [apiFilter, setApiFilter] = useState<GetIpListParams>(
    searchToApiFilter(search),
  );

  React.useEffect(() => {
    setApiFilter((prev) => ({ ...prev, ...searchToApiFilter(search) }));
  }, [search]);

  const setApiFilterWithUrlUpdate = React.useCallback(
    (updater: React.SetStateAction<GetIpListParams>) => {
      // Let the state update to the next tick to avoid sync issues and warnings about set state during render
      setTimeout(() => {
        setApiFilter((prev) => {
          const newFilter =
            typeof updater === 'function' ? updater(prev) : updater;
          setSearch(cleanApiFilter(newFilter), { replace: true });
          return newFilter;
        });
      });
    },
    [],
  );

  const addExpiredIp = React.useCallback((expiredIp: string) => {
    setExpiredIps((ips) => {
      if (ips.indexOf(expiredIp) === -1) {
        return ips.concat(expiredIp);
      }
      return ips;
    });
  }, []);

  const listingContext = useMemo(
    () => ({
      apiFilter,
      setApiFilter: setApiFilterWithUrlUpdate,
      hasNoApiFilter: !search || search.size === 0,
      expiredIps,
      addExpiredIp,
    }),
    [apiFilter, expiredIps],
  );

  return (
    <ListingContext.Provider value={listingContext}>
      {children}
    </ListingContext.Provider>
  );
};
