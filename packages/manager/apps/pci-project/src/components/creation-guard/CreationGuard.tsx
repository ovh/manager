import { lazy, useContext } from 'react';

import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import useCreationRedirect from '@/hooks/use-creation-redirect/useCreationRedirect';

const CreationPage = lazy(() => import('@/pages/creation/Creation.page'));
const CreationLegacyPage = lazy(() => import('@/pages/creation/Creation.legacy.page'));

export default function CreationGuard() {
  const { environment } = useContext(ShellContext);
  const region = environment.getRegion();
  const isUSRegion = String(region) === 'US';
  const { shouldBlockCreation, redirectRoute, isLoading } = useCreationRedirect();

  if (isUSRegion) {
    return <CreationLegacyPage />;
  }

  return (
    <RedirectionGuard condition={shouldBlockCreation} route={redirectRoute} isLoading={isLoading}>
      <CreationPage />
    </RedirectionGuard>
  );
}
