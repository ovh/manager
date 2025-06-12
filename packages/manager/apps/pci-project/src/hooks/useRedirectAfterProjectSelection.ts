import { useCallback, useContext, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import useActiveProjects from '../data/hooks/useActiveProjects';
import useRedirectTarget, { TRedirectTarget } from './useRedirectTarget';
import useCheckFeatureAvailability, {
  TFeatureAvailabilityState,
} from './useCheckFeatureAvailability';

export type TRedirectStatus = {
  isRedirectRequired: boolean;
  redirectUrl: (projectId: string) => Promise<string>;
  redirect: (projectId: string) => void;
};

type TRedirectInformation = {
  isRedirectExternal: boolean;
  redirectExternalUrl: string;
  redirectPath: string;
  redirectParams: Record<string, string>;
};

/**
 * Determines redirect information based on feature state and availability conditions.
 *
 * @param redirectTarget - Object containing redirect requirements and configuration
 * @param redirectTarget.isRedirectRequired - Whether a redirect is required
 * @param redirectTarget.redirectTargetParams - Function to get redirect parameters by target key
 * @param redirectTarget.featureState - Current state of the feature including URL and configuration
 * @param featureAvailability - Object containing feature availability state
 * @param featureAvailability.available - Whether the feature flag is available
 * @param featureAvailability.check - Whether feature flag checking should be performed
 *
 * @returns Object containing redirect information including external URL, path, and parameters.
 *          Returns empty redirect information if conditions are not met.
 */
const getRedirectInformation = (
  { isRedirectRequired, redirectTargetParams, featureState }: TRedirectTarget,
  {
    available: isFFAvailable,
    check: shouldCheckFeatureFlipping,
  }: TFeatureAvailabilityState,
): TRedirectInformation => {
  if (
    isRedirectRequired &&
    featureState &&
    (!shouldCheckFeatureFlipping || isFFAvailable)
  ) {
    return {
      isRedirectExternal: featureState.isExternal || false,
      redirectExternalUrl: featureState.url,
      redirectPath: featureState.url,
      redirectParams: redirectTargetParams,
    };
  }
  return {
    isRedirectExternal: false,
    redirectExternalUrl: '',
    redirectPath: '',
    redirectParams: {},
  };
};

/**
 * Hook that manages redirection logic after project selection in a multi-project environment.
 *
 * It will check for a `target` parameter in the URL, which contains information about
 * the desired redirection state, including the category and state of the feature to redirect to.
 *
 * This hook handles automatic redirection when only one project is available, and provides
 * utilities for manual redirection when multiple projects are present. It supports both
 * internal navigation within the application and external URL redirects.
 *
 * @returns An object containing:
 * - `isRedirectRequired`: Boolean indicating if a redirect is needed
 * - `redirectUrl`: Function that generates the redirect URL for a given project ID
 * - `redirect`: Function that performs the actual redirection for a given project ID
 *
 * @example
 * ```typescript
 * const { isRedirectRequired, redirect, redirectUrl } = useRedirectAfterProjectSelection();
 *
 * if (isRedirectRequired) {
 *   // Show project selection UI
 *   const handleProjectSelect = (projectId: string) => {
 *     redirect(projectId);
 *   };
 * }
 * // If only one project, redirection happens automatically
 * ```
 */
export default (): TRedirectStatus => {
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { activeProjects, isReady } = useActiveProjects();
  const redirectTarget = useRedirectTarget();

  const featureAvailabilityState = useCheckFeatureAvailability(
    redirectTarget.featureState,
  );

  const {
    isRedirectExternal,
    redirectExternalUrl,
    redirectParams,
    redirectPath,
  } = getRedirectInformation(redirectTarget, featureAvailabilityState);

  const redirect = useCallback(
    (projectId: string) => {
      if (isRedirectExternal) {
        (window.top || window).location = redirectExternalUrl.replace(
          /:projectId/g,
          projectId,
        );
      } else {
        navigation.navigateTo('public-cloud', redirectPath, {
          ...redirectParams,
          projectId,
        });
      }
    },
    [
      isRedirectExternal,
      redirectExternalUrl,
      redirectPath,
      redirectParams,
      navigation,
    ],
  );

  const redirectUrl = useCallback(
    async (projectId: string): Promise<string> => {
      if (isRedirectExternal) {
        return redirectExternalUrl.replace(/:projectId/g, projectId);
      }
      return navigation
        .getURL('public-cloud', redirectPath, {
          ...redirectParams,
          projectId,
        })
        .then((url) => url as string);
    },
    [
      isRedirectExternal,
      redirectExternalUrl,
      redirectPath,
      redirectParams,
      navigation,
    ],
  );

  useEffect(() => {
    // We immediately redirect because there is only one project
    if (
      isReady &&
      redirectTarget.isRedirectRequired &&
      activeProjects.length === 1 &&
      redirectPath !== ''
    ) {
      redirect(activeProjects[0].project_id);
    }
  }, [
    isReady,
    redirectTarget.isRedirectRequired,
    activeProjects,
    redirectPath,
    redirect,
  ]);

  return {
    isRedirectRequired:
      isReady && redirectTarget.isRedirectRequired && activeProjects.length > 1,
    redirectUrl,
    redirect,
  };
};
