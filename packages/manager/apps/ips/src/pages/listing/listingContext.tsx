import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
} from 'react';
import { GetIpListParams } from '@/data/api';

export type ListingContextType = {
  apiFilter: GetIpListParams;
  setApiFilter: (apiFilter: GetIpListParams) => void;
  ipToSearch: string;
  setIpToSearch: (ipToSearch: string) => void;
  expiredIps: string[];
  addExpiredIp: (expiredIp: string) => void;
};

export const ListingContext = createContext<ListingContextType | null>(null);

export const ListingContextProvider = ({ children }: PropsWithChildren) => {
  const [apiFilter, setApiFilter] = useState<GetIpListParams>();
  const [ipToSearch, setIpToSearch] = useState<string>();
  const [expiredIps, setExpiredIps] = useState<string[]>([]);

  const listingContext = useMemo(
    () => ({
      apiFilter,
      setApiFilter,
      ipToSearch,
      setIpToSearch,
      expiredIps,
      addExpiredIp: (expiredIp: string) => {
        if (expiredIps.indexOf(expiredIp) === -1) {
          setExpiredIps((ips) => ips.concat(expiredIp));
        }
      },
    }),
    [apiFilter, ipToSearch, expiredIps],
  );

  return (
    <ListingContext.Provider value={listingContext}>
      {children}
    </ListingContext.Provider>
  );
};
