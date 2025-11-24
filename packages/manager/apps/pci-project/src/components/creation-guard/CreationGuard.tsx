import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { lazy, useContext } from 'react';
import useCreationRedirect from '@/hooks/useCreationRedirect/useCreationRedirect';

const CreationPage = lazy(() => import('@/pages/creation/Creation.page'));
const CreationLegacyPage = lazy(() =>
  import('@/pages/creation/Creation.legacy.page'),
);

export default function CreationGuard() {
  const { environment } = useContext(ShellContext);
  const region = environment.getRegion();
  const isUSRegion = region === 'US';

  if (isUSRegion) {
    return <CreationLegacyPage />;
  }

  const {
    shouldBlockCreation,
    redirectRoute,
    isLoading,
  } = useCreationRedirect();

  return (
    <RedirectionGuard
      condition={shouldBlockCreation}
      route={redirectRoute}
      isLoading={isLoading}
    >
      <CreationPage />
    </RedirectionGuard>
  );
}
