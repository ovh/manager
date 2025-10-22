import { useIsAskIncreaseProjectsQuota } from '@/data/hooks/useEligibility';
import { useDiscoveryProject } from '@/data/hooks/useProjects';
import { urls } from '@/routes/routes.constant';

/**
 * Hook to determine if user should be redirected away from the project creation page.
 * Handles two scenarios:
 * 1. User needs to increase their project quota first
 * 2. User has a discovery project that needs to be activated
 *
 * @returns Object containing redirection state and route information
 */
export default function useCreationRedirect() {
  const {
    data: shouldRedirectToIncreaseQuota,
    isLoading: isQuotaLoading,
  } = useIsAskIncreaseProjectsQuota();

  const {
    data: discoveryProject,
    isPending: isDiscoveryPending,
  } = useDiscoveryProject();

  const shouldBlockCreation =
    shouldRedirectToIncreaseQuota || !!discoveryProject;

  const redirectRoute = discoveryProject
    ? `../${discoveryProject.project_id}?activateDiscovery=1`
    : `../${urls.increaseQuota}`;

  const isLoading = isQuotaLoading || isDiscoveryPending;

  return {
    shouldRedirectToIncreaseQuota: shouldRedirectToIncreaseQuota || false,
    shouldBlockCreation,
    redirectRoute,
    isLoading,
  };
}
