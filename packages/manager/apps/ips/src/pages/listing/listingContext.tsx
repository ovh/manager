import {
  PropsWithChildren,
  createContext,
  useMemo,
  useState,
  useCallback,
  SetStateAction,
  useEffect,
} from 'react';

import { useSearchParams } from 'react-router-dom';

import { useQueries, useQueryClient } from '@tanstack/react-query';

import {
  GetIpListParams,
  getIpDetails,
  getIpDetailsQueryKey,
  getIpListQueryKey,
} from '@/data/api';

import { cleanApiFilter, searchToApiFilter } from './listing.utils';

export type ListingContextType = {
  apiFilter: GetIpListParams;
  setApiFilter: React.Dispatch<React.SetStateAction<GetIpListParams>>;
  hasNoApiFilter: boolean;
  expiredIps: string[];
  addExpiredIp: (expiredIp: string) => void;
  onGoingSlicedIps: string[];
  setOnGoingSlicedIps: React.Dispatch<React.SetStateAction<string[]>>;
  onGoingAggregatedIps: string[];
  setOnGoingAggregatedIps: React.Dispatch<React.SetStateAction<string[]>>;
  onGoingCreatedIps: string[];
  setOnGoingCreatedIps: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ListingContext = createContext<ListingContextType>({
  addExpiredIp: () => {},
  apiFilter: {},
  expiredIps: [],
  hasNoApiFilter: true,
  setApiFilter: () => {},
  onGoingSlicedIps: [],
  onGoingAggregatedIps: [],
  setOnGoingAggregatedIps: () => {},
  setOnGoingSlicedIps: () => {},
  onGoingCreatedIps: [],
  setOnGoingCreatedIps: () => {},
});

export const ListingContextProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useSearchParams();
  const [expiredIps, setExpiredIps] = useState<string[]>([]);
  const [apiFilter, setApiFilter] = useState<GetIpListParams>(
    searchToApiFilter(search),
  );
  const [onGoingSlicedIps, setOnGoingSlicedIps] = useState<string[]>([]);
  const [onGoingAggregatedIps, setOnGoingAggregatedIps] = useState<string[]>(
    [],
  );
  const [onGoingCreatedIps, setOnGoingCreatedIps] = useState<string[]>([]);

  useQueries({
    queries: onGoingCreatedIps.map((ip) => ({
      queryKey: getIpDetailsQueryKey({ ip }),
      queryFn: async () => {
        const result = await getIpDetails({ ip });

        queryClient.invalidateQueries({
          queryKey: getIpListQueryKey(apiFilter),
        });

        setOnGoingCreatedIps((ips) =>
          ips.filter((ongoingIp) => ongoingIp !== ip),
        );
        setOnGoingAggregatedIps([]);
        setOnGoingSlicedIps([]);

        return result;
      },
      // Refetch until IP is available or 30 tries
      retryDelay: 10000,
      retry: 30,
    })),
  });

  useEffect(() => {
    setApiFilter((prev) => ({ ...prev, ...searchToApiFilter(search) }));
  }, [search]);

  const setApiFilterWithUrlUpdate = useCallback(
    (updater: SetStateAction<GetIpListParams>) => {
      setApiFilter((prev) => {
        const newFilter =
          typeof updater === 'function' ? updater(prev) : updater;
        // Let the state update to the next tick to avoid sync issues and warnings about set state during render
        setTimeout(() => {
          setSearch(cleanApiFilter(newFilter), { replace: true });
        });
        return newFilter;
      });
    },
    [setSearch],
  );

  const addExpiredIp = useCallback((expiredIp: string) => {
    setExpiredIps((ips) =>
      ips.indexOf(expiredIp) === -1 ? ips.concat(expiredIp) : ips,
    );
  }, []);

  const listingContext = useMemo(
    () => ({
      apiFilter,
      setApiFilter: setApiFilterWithUrlUpdate,
      hasNoApiFilter: !search || search.size === 0,
      expiredIps,
      addExpiredIp,
      onGoingSlicedIps,
      onGoingAggregatedIps,
      setOnGoingSlicedIps,
      setOnGoingAggregatedIps,
      onGoingCreatedIps,
      setOnGoingCreatedIps,
    }),
    [
      apiFilter,
      setApiFilterWithUrlUpdate,
      search,
      expiredIps,
      addExpiredIp,
      onGoingAggregatedIps,
      onGoingSlicedIps,
      onGoingCreatedIps,
    ],
  );

  return (
    <ListingContext.Provider value={listingContext}>
      {children}
    </ListingContext.Provider>
  );
};
