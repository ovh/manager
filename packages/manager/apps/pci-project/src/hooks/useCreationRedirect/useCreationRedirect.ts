import { useIsAskIncreaseProjectsQuota } from '@/data/hooks/payment/useEligibility';

export default function useCreationRedirect() {
  const {
    data: shouldRedirectToIncreaseQuota,
    isLoading,
  } = useIsAskIncreaseProjectsQuota();

  return {
    shouldRedirectToIncreaseQuota: shouldRedirectToIncreaseQuota || false,
    isLoading,
  };
}
