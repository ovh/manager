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

export default function Create() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [hasRancherCreationError, setRancherCreationError] = React.useState(
    false,
  );

  const { createRancher } = useCreateRancher({
    projectId,
    onSuccess: () => navigate(`/pci/projects/${projectId}/rancher`),
    onError: () => setRancherCreationError(true),
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
        projectId={projectId}
        hasRancherCreationError={hasRancherCreationError}
        onCreateRancher={createRancher}
        versions={versions?.data.sort((a) =>
          a.status === 'AVAILABLE' ? -1 : 1,
        )}
        plans={plans?.data.sort((a) => (a.status === 'AVAILABLE' ? -1 : 1))}
      />
    </PageLayout>
  );
}
