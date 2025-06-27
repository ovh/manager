import { useQuery } from '@tanstack/react-query';
import { getEligibility } from '@/data/api/payment/eligibility';

export const eligibilityQueryKey = () => ['cloud', 'eligibility'];

export const useEligibility = () => {
  return useQuery({
    queryKey: eligibilityQueryKey(),
    queryFn: getEligibility,
  });
};
