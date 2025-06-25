import React, { useEffect } from 'react';
import {
  useAuthorizationIam,
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ParentEnum } from '@/enum/parent.enum';
import {
  allDomFeatureAvailibility,
  iamGetAllDomAction,
  taskMeAllDom,
  taskMeDomain,
} from '@/constants';
import DashboardPage from '@/components/Dashboard/DashboardPage';
import { useGetIAMResourceAllDom } from '@/hooks/iam/iam';
import { urls } from '@/routes/routes.constant';

export default function AllDom() {
  const { notifications } = useNotifications();

  // Get IAM authorization for the IAM resource
  // Redirect to domain tab if the user don't have access to the page
  const { data: allDomIAMRessources } = useGetIAMResourceAllDom();
  const navigate = useNavigate();
  const urn = allDomIAMRessources?.[0]?.urn;
  const { isAuthorized = false } = useAuthorizationIam(
    [iamGetAllDomAction],
    urn,
  );
  const { data: availability } = useFeatureAvailability([
    allDomFeatureAvailibility,
  ]);
  useEffect(() => {
    if (!urn || !availability[allDomFeatureAvailibility] || !isAuthorized) {
      navigate(`/${urls.domain}`);
    }
  }, [urn, availability, isAuthorized]);

  // We use TaskMeDomain here because the alldom task has the same api route than domain tasks, only the type change.
  return (
    <React.Suspense>
      <DashboardPage
        searchableColumnID={ParentEnum.DOMAIN}
        parent={ParentEnum.ALLDOM}
        notifications={notifications}
        route={`${taskMeDomain.join('/')}?type=alldom`}
        queryKey={taskMeAllDom}
      />
    </React.Suspense>
  );
}
