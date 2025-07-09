import { useState, useEffect, useMemo, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import { useEligibility } from '@/data/hooks/useEligibility';
import { PaymentMethod } from '@/data/types/eligibility.type';
import useActiveProjects from '@/data/hooks/useActiveProjects';
import { PlanCode } from '@/data/types/cart.type';
import { TProjectWithService } from '@/data/types/project.type';
import { urls } from '@/routes/routes.constant';
import { BASE_PROJECT_PATH } from '@/constants';

export default function DiscoveryGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [redirectionGuardChecked, setRedirectionGuardChecked] = useState(false);
  const goToProjectCreation = () => navigate(`../${urls.creation}`);
  const goToProjectsList = () => navigate(`../${urls.listing}`);
  const goToProject = (project: TProjectWithService) => {
    navigation.navigateTo('public-cloud', BASE_PROJECT_PATH, {
      projectId: project.project_id,
    });
  };

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
      PaymentMethod.CREDIT,
    );
    return hasCreditAvailable;
  }, [eligibility, isEligibilityError]);

  const {
    activeProjects,
    isReady: isActiveProjectsReady,
  } = useActiveProjects();
  useEffect(() => {
    // If user has credit enabled, redirect them to actual project creation page
    if (redirectToProjectCreation) {
      goToProjectCreation();
      return;
    }

    // NOTE: to keep the existing behavior, the 'eligibility' check must be done before the projects check.
    if (isEligibilityLoading || !isActiveProjectsReady) {
      return;
    }

    // If there are unpaid projects among existing one, show listing
    const unpaidProjects = activeProjects.filter((d) => d.isUnpaid);
    if (unpaidProjects.length > 0) {
      goToProjectsList();
      return;
    }

    // If user already have projects, show discovery or default as priority.
    const discoveryProject =
      activeProjects.find((d) => isDiscoveryProject(d)) || null;
    const defaultProject = activeProjects.find((d) => d.isDefault) || null;
    if (discoveryProject || defaultProject) {
      goToProject((discoveryProject || defaultProject) as TProjectWithService);
      return;
    }

    // If user have projects (but no default or discovery), show listing.
    const otherActiveProjects = activeProjects.filter(
      (d) => d.planCode === PlanCode.PROJECT_2018,
    );
    if (otherActiveProjects.length > 0) {
      goToProjectsList();
      return;
    }

    // When everything is loaded but there is no need for redirection, show the content.
    // Note that at first we only hid the guarded content behind the 'isLoading' logic,
    // but that created a brief flash of rendering the guarded content in case of redirection.
    // (isLoading was false but redirection still had a frame to take effect).
    if (!isEligibilityLoading && isActiveProjectsReady) {
      setRedirectionGuardChecked(true);
    }
  }, [
    redirectToProjectCreation,
    activeProjects,
    isEligibilityLoading,
    isActiveProjectsReady,
  ]);

  const isLoading =
    isEligibilityLoading || !isActiveProjectsReady || !redirectionGuardChecked;
  return isLoading ? <OdsSpinner /> : <>{children}</>;
}
