import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import useCreateRancher from '@/hooks/useCreateRancher';
import CreateRancher from '@/components/layout-helpers/CreateRancher/CreateRancher';
import PageLayout from '@/components/PageLayout/PageLayout';
import { CreateRancherPayload } from '@/api/api.type';
import {
  getRancherPlan,
  getRancherVersion,
  getReferenceRancherInfo,
} from '@/api';

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

  const onCreateRancher = (rancherPayload: CreateRancherPayload) => {
    createRancher(rancherPayload);
    navigate(`/pci/projects/${projectId}/rancher`);
  };

  const goToOnboarding = () =>
    navigate(`/pci/projects/${projectId}/rancher/onboarding`);

  return (
    <PageLayout>
      <Breadcrumb />
      <CreateRancher
        hasRancherCreationError={hasRancherCreationError}
        onCancelClick={goToOnboarding}
        onCreateRancher={onCreateRancher}
        versions={versions?.data.sort((a) =>
          a.status === 'AVAILABLE' ? -1 : 1,
        )}
        plans={plans?.data.sort((a) => (a.status === 'AVAILABLE' ? -1 : 1))}
      />
    </PageLayout>
  );
}
