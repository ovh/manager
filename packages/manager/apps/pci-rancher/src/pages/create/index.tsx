import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getRancherPlan,
  getRancherVersion,
  getReferenceRancherInfo,
} from '@/api';
import PageLayout from '@/components/PageLayout/PageLayout';
import CreateRancher from '@/components/layout-helpers/CreateRancher/CreateRancher';
import useCreateRancher from '@/hooks/useCreateRancher';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { getRanchersUrl } from '@/utils/route';
import usePciProject from '@/hooks/usePciProject';
import { PciProjectPlanCode } from '@/api/api.type';
import { useRanchers } from '@/hooks/useRancher';
import {
  useSimpleTrackingPage,
  useTrackingAction,
  useTrackingPage,
} from '../../hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '../../utils/tracking';
import { useTracking } from '@ovh-ux/manager-react-shell-client';

export default function Create() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [hasRancherCreationError, setHasRancherCreationError] = React.useState(
    false,
  );
  useTrackingPage(TrackingPageView.CreateRancher);
  const trackAction = useTrackingAction();
  const trackingPage = useSimpleTrackingPage();

  const { data: project } = usePciProject();

  const { data: ranchers, refetch: refetchRancherList } = useRanchers();

  const { createRancher } = useCreateRancher({
    projectId,
    onMutate: () => setHasRancherCreationError(false),
    onSuccess: () => {
      refetchRancherList();
      trackAction(
        trackingPage(
          `${TrackingPageView.CreateRancher}::${TrackingEvent.add}-success}`,
        ),
      );
      navigate(getRanchersUrl(projectId));
    },
    onError: () => {
      trackingPage(
        `${TrackingPageView.CreateRancher}::${TrackingEvent.add}-error}`,
      );
      setHasRancherCreationError(true);
    },
  });

  const { data: plans } = useQuery({
    queryKey: [getReferenceRancherInfo('plan')],
    queryFn: () => getRancherPlan(),
  });

  const { data: versions } = useQuery({
    queryKey: [getReferenceRancherInfo('version')],
    queryFn: () => getRancherVersion(),
  });

  return (
    <PageLayout>
      <Breadcrumb />
      <CreateRancher
        hasSomeRancher={ranchers?.data.length > 0}
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
