import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@ovh-ux/manager-react-components';
import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { getRancherPlan, getReferenceRancherInfo } from '@/data/api/services';
import CreateRancher from '@/components/layout-helpers/CreateRancher/CreateRancher.component';
import useCreateRancher from '@/data/hooks/useCreateRancher/useCreateRancher';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import { getRanchersUrl } from '@/utils/route';
import { RancherService } from '@/types/api.type';
import { ranchersQueryKey } from '@/data/hooks/useRancher/useRancher';
import {
  useSimpleTrackingPage,
  useTrackingPage,
} from '@/hooks/useTrackingPage/useTrackingPage';
import {
  TRACKING_PATH,
  TrackingEvent,
  TrackingPageView,
} from '../../utils/tracking';

import { useRancherPrices } from '@/hooks/useRancherPrices';
import queryClient from '@/queryClient';
import useVersions from '@/data/hooks/useVersions/useVersions';

export default function Create() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [hasRancherCreationError, setHasRancherCreationError] = useState(false);
  const [
    rancherCreationErrorMessage,
    setRancherCreationErrorMessage,
  ] = useState<{ class: string; message: string } | null>(null);
  useTrackingPage(TrackingPageView.CreateRancher);
  const trackingPage = useSimpleTrackingPage();

  const { data: project } = useProject();

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
      if (error?.response?.data) {
        setRancherCreationErrorMessage(error?.response?.data);
      }
    },
  });

  const { data: plans } = useQuery({
    queryKey: [getReferenceRancherInfo(projectId, 'plan')],
    queryFn: () => getRancherPlan(projectId),
  });
  const { plansPricing } = useRancherPrices();
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
        pricing={plansPricing}
        isProjectDiscoveryMode={isDiscoveryProject(project)}
      />
    </PageLayout>
  );
}
