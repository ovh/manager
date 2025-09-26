import { lazy } from 'react';
import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import useCreationRedirect from '@/hooks/useCreationRedirect/useCreationRedirect';

const CreationPage = lazy(() => import('@/pages/creation/Creation.page'));

export default function CreationGuard() {
  const { shouldRedirectToIncreaseQuota, isLoading } = useCreationRedirect();

  return (
    <RedirectionGuard
      condition={shouldRedirectToIncreaseQuota}
      route={`../${urls.increaseQuota}`}
      isLoading={isLoading}
    >
      <CreationPage />
    </RedirectionGuard>
  );
}
