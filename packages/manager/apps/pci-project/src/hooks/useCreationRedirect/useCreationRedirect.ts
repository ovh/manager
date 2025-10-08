import { useIsAskIncreaseProjectsQuota } from '@/data/hooks/useEligibility';

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
