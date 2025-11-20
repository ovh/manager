import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useNavigate, useResolvedPath } from 'react-router-dom';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { BASE_PROJECT_PATH } from '@/constants';
import useActiveProjects from '@/data/hooks/useActiveProjects';
import { useEligibility } from '@/data/hooks/useEligibility';
import { PlanCode } from '@/data/models/Cart.type';
import { TEligibilityPaymentMethod } from '@/data/models/Eligibility.type';
import { TProjectWithService } from '@/data/models/Project.type';
import { urls } from '@/routes/routes.constant';
import { TProject } from '@/types/pci-common.types';

export default function DiscoveryGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [redirectionGuardChecked, setRedirectionGuardChecked] = useState(false);
  const { pathname: projectCreationUrl } = useResolvedPath(`../${urls.creation}`);
  const { pathname: projectListingUrl } = useResolvedPath(`../${urls.listing}`);
  const goToProject = useCallback(
    (project: TProjectWithService) => {
      navigation.navigateTo('public-cloud', BASE_PROJECT_PATH, {
        projectId: project.project_id,
      });
    },
    [navigation],
  );

  // (The following comment was copied from original `projects.routing.js`.)
  // 2024-02-12 : At the time we introduce the discovery mode,
  // users who are eligible for the "credit" payment method
  // cannot upgrade a project from the discovery project plan code
  // to the full featured project plan code.
  // These users must use the classic project creation funnel.
  // If user can add credit, he's to be redirected directly to project creation.
  const {
    data: eligibility,
    isLoading: isEligibilityLoading,
    isError: isEligibilityError,
  } = useEligibility();
  const redirectToProjectCreation = useMemo(() => {
    if (!eligibility) return false;
    if (isEligibilityError) return false;
    const hasCreditAvailable = eligibility.paymentMethodsAuthorized.includes(
      TEligibilityPaymentMethod.CREDIT,
    );
    return hasCreditAvailable;
  }, [eligibility, isEligibilityError]);

  const { activeProjects, isReady: isActiveProjectsReady } = useActiveProjects();
  useEffect(() => {
    // NOTE: to keep the existing behavior, the 'eligibility' check must be done before the projects check.
    if (isEligibilityLoading || !isActiveProjectsReady) {
      return;
    }

    // If there are unpaid projects among existing one, show listing
    const unpaidProjects = activeProjects.filter((d) => d.isUnpaid);
    if (unpaidProjects.length > 0) {
      navigate(projectListingUrl);
      return;
    }

    // If user already have projects, show discovery or default as priority.
    const discoveryProject =
      activeProjects.find((d) => (isDiscoveryProject as (p: TProject) => boolean)(d)) || null;
    const defaultProject = activeProjects.find((d) => d.isDefault) || null;
    if (discoveryProject || defaultProject) {
      goToProject((discoveryProject || defaultProject) as TProjectWithService);
      return;
    }

    // If user have projects (but no default or discovery), show listing.
    const otherActiveProjects = activeProjects.filter(
      (d) => d.planCode === (PlanCode.PROJECT_2018 as string),
    );
    if (otherActiveProjects.length > 0) {
      navigate(projectListingUrl);
      return;
    }

    // If user has credit enabled, redirect them to actual project creation page
    if (redirectToProjectCreation) {
      navigate(projectCreationUrl);
      return;
    }

    // When everything is loaded but there is no need for redirection, show the content.
    // Note that at first we only hid the guarded content behind the 'isLoading' logic,
    // but that created a brief flash of rendering the guarded content in case of redirection.
    // (isLoading was false but redirection still had a frame to take effect).
    if (!isEligibilityLoading && isActiveProjectsReady) {
      setTimeout(() => setRedirectionGuardChecked(true), 0);
    }
  }, [
    redirectToProjectCreation,
    activeProjects,
    isEligibilityLoading,
    isActiveProjectsReady,
    projectListingUrl,
    projectCreationUrl,
    goToProject,
    navigate,
  ]);

  const isLoading = isEligibilityLoading || !isActiveProjectsReady || !redirectionGuardChecked;
  return isLoading ? <OdsSpinner /> : <>{children}</>;
}
