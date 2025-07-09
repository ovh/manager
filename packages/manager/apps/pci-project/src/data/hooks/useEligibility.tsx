import { useQuery } from '@tanstack/react-query';
import { getEligibility } from '@/data/api/eligibility';
import { TEligibility } from '@/data/types/eligibility.type';

export const useEligibility = () => {
  return useQuery<TEligibility>({
    queryKey: ['cloud', 'eligibility'],
    queryFn: async () => getEligibility(),
  });
};
