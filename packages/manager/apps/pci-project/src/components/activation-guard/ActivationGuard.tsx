import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { lazy, useMemo } from 'react';

const ActivatePage = lazy(() =>
  import('@/pages/detail/activate/Activate.page'),
);

/**
 * ActivationGuard component that protects the activation page route.
 * It redirects to the Home page if the project is already activated (not a discovery project).
 *
 * @returns RedirectionGuard component with ActivatePage as child
 */
export default function ActivationGuard() {
  const { data: project, isLoading } = useProject();

  const isAlreadyActivated = useMemo(() => {
    if (!project) {
      return false;
    }
    return !isDiscoveryProject(project);
  }, [project]);

  return (
    <RedirectionGuard
      condition={isAlreadyActivated}
      route=".."
      isLoading={isLoading}
    >
      <ActivatePage />
    </RedirectionGuard>
  );
}
