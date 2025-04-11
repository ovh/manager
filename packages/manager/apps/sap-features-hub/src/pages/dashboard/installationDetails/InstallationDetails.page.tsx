import { useParams } from 'react-router-dom';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { InstallationDetailsSummary } from '@/components/InstallationDetails/InstallationDetailsSummary.component';
import { InstallationDetailsProgress } from '@/components/InstallationDetails/InstallationDetailsProgress.component';
import { InstallationDetailsError } from '@/components/InstallationDetails/InstallationDetailsError.component';
import { useAutoRefetch } from '@/hooks/useAutoRefetch';
import {
  installationTaskDetailsQueryKey,
  useMockInstallationTaskDetails,
} from '@/hooks/installationDetails/useInstallationDetails';
import { SAPInstallationStatus } from '@/types/installation.type';

const REFECTH_INTERVAL_INSTALLATION_STATUS = 30_000;

export default function InstallationDetailsPage() {
  const { serviceName, taskId } = useParams();
  const { t } = useTranslation('dashboard/installation');
  const header = {
    title: t('dashboard_installation_title'),
    description: t('dashboard_installation_description'),
  };

  const { data: installationTaskDetails } = useMockInstallationTaskDetails({
    serviceName,
    taskId,
  });

  useAutoRefetch({
    queryKey: installationTaskDetailsQueryKey({ serviceName, taskId }),
    enabled: [
      SAPInstallationStatus.pending,
      SAPInstallationStatus.retry,
      SAPInstallationStatus.started,
    ].includes(installationTaskDetails?.status),
    interval: REFECTH_INTERVAL_INSTALLATION_STATUS,
  });

  return (
    <Suspense>
      <BaseLayout breadcrumb={<Breadcrumb />} header={header}>
        <div className="flex flex-col gap-8">
          <InstallationDetailsError serviceName={serviceName} taskId={taskId} />
          <InstallationDetailsSummary
            serviceName={serviceName}
            taskId={taskId}
          />
          <InstallationDetailsProgress
            serviceName={serviceName}
            taskId={taskId}
          />
        </div>
      </BaseLayout>
    </Suspense>
  );
}
