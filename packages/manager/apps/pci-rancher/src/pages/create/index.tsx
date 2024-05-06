import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@ovhcloud/manager-components';
import {
  getRancherPlan,
  getRancherVersion,
  getReferenceRancherInfo,
} from '@/api';
import CreateRancher from '@/components/layout-helpers/CreateRancher/CreateRancher';
import useCreateRancher from '@/hooks/useCreateRancher';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { getRanchersUrl } from '@/utils/route';
import usePciProject from '@/hooks/usePciProject';
import { PciProjectPlanCode, RancherService } from '@/api/api.type';
import { ranchersQueryKey } from '@/hooks/useRancher';
import {
  useSimpleTrackingPage,
  useTrackingPage,
} from '../../hooks/useTrackingPage';
import {
  TRACKING_PATH,
  TrackingEvent,
  TrackingPageView,
} from '../../utils/tracking';
import queryClient from '@/query.client';

export default function Create() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [hasRancherCreationError, setHasRancherCreationError] = React.useState(
    false,
  );
  useTrackingPage(TrackingPageView.CreateRancher);
  const trackingPage = useSimpleTrackingPage();

  const { data: project } = usePciProject();

  const ranchersQueryKeyValue = ranchersQueryKey(projectId);

  const { mutate: createRancher, isPending } = useCreateRancher({
    projectId,
    onMutate: () => setHasRancherCreationError(false),
    onSuccess: (data: { data: RancherService }) => {
      queryClient.setQueryData(
        ranchersQueryKeyValue,
        (old: RancherService[]) => [...old, data.data],
      );
      trackingPage(`${TRACKING_PATH}::${TrackingEvent.add}-success`);
      navigate(getRanchersUrl(projectId));
    },
    onError: () => {
      trackingPage(`${TRACKING_PATH}::${TrackingEvent.add}-error`);
      setHasRancherCreationError(true);
    },
  });

  const { data: plans } = useQuery({
    queryKey: [getReferenceRancherInfo(projectId, 'plan')],
    queryFn: () => getRancherPlan(projectId),
  });

  const { data: versions } = useQuery({
    queryKey: [getReferenceRancherInfo(projectId, 'version')],
    queryFn: () => getRancherVersion(projectId),
  });

  return (
    <PageLayout>
      <Breadcrumb />
      <CreateRancher
        isCreateRancherLoading={isPending}
        projectId={projectId}
        hasRancherCreationError={hasRancherCreationError}
        onCreateRancher={createRancher}
        versions={versions?.data.filter((v) => v.status === 'AVAILABLE')}
        plans={plans?.data}
        isProjectDiscoveryMode={
          project?.planCode === PciProjectPlanCode.DISCOVERY
        }
      />
    </PageLayout>
  );
}
