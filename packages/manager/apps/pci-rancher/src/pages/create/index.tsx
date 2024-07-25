import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@ovhcloud/manager-components';
import { getRancherPlan, getReferenceRancherInfo } from '@/api';
import CreateRancher from '@/components/layout-helpers/CreateRancher/CreateRancher.component';
import useCreateRancher from '@/hooks/useCreateRancher';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.component';
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
import queryClient from '@/queryClient';
import useVersions from '@/hooks/useVersions';

export default function Create() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [hasRancherCreationError, setHasRancherCreationError] = useState(false);
  const [
    rancherCreationErrorMessage,
    setRancherCreationErrorMessage,
  ] = useState<string | null>(null);
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
    onError: (error) => {
      trackingPage(`${TRACKING_PATH}::${TrackingEvent.add}-error`);
      setHasRancherCreationError(true);
      if (error?.response?.data?.message) {
        setRancherCreationErrorMessage(error.response.data.message);
      }
    },
  });

  const { data: plans } = useQuery({
    queryKey: [getReferenceRancherInfo(projectId, 'plan')],
    queryFn: () => getRancherPlan(projectId),
  });

  const { data: versions } = useVersions();

  return (
    <PageLayout>
      <Breadcrumb />
      <CreateRancher
        isCreateRancherLoading={isPending}
        projectId={projectId}
        hasRancherCreationError={hasRancherCreationError}
        rancherCreationErrorMessage={rancherCreationErrorMessage}
        onCreateRancher={createRancher}
        versions={versions?.filter((v) => v.status === 'AVAILABLE')}
        plans={plans?.data}
        isProjectDiscoveryMode={
          project?.planCode === PciProjectPlanCode.DISCOVERY
        }
      />
    </PageLayout>
  );
}
