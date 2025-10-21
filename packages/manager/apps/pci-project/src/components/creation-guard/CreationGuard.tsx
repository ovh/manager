import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { lazy } from 'react';
import useCreationRedirect from '@/hooks/useCreationRedirect/useCreationRedirect';

const CreationPage = lazy(() => import('@/pages/creation/Creation.page'));

export default function CreationGuard() {
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
