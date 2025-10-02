import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { TLocation } from '@/types/Location.type';

import { getLocationDetails } from '../api/Location.api';

type TUseLocationResult = UseQueryResult<TLocation, Error>;

export const useLocationDetails = (name: string): TUseLocationResult =>
  useQuery({
    queryKey: ['location', name],
    queryFn: () => getLocationDetails(name),
    select: (res) => res.data,
  });
