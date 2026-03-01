import { getGeolocation } from '@/data/api/me/me.api';
import { OptionsFor, useQueryImmediateRefetch } from '../useImmediateRefetch.hook';

export function useGetGeolocation(options?: OptionsFor<typeof getGeolocation>) {
  const queryKey = ['/me/geolocation'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: getGeolocation,
    ...options,
  });
}
