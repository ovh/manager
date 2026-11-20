import { useQuery } from '@tanstack/react-query';
import { getGermanRegistersByCourt } from '@/data/api/suggestion';

/** The German register courts: one call when the register id shows. */
export const useGermanRegisterCourts = (enabled: boolean) =>
  useQuery({
    queryKey: ['/me/suggest/germanRegistersByCourt'],
    queryFn: getGermanRegistersByCourt,
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
  });
