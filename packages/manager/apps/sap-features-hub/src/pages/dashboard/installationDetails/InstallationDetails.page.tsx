import { useParams } from 'react-router-dom';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { InstallationDetailsSummary } from '@/components/InstallationDetails/InstallationDetailsSummary.component';
import { InstallationDetailsProgress } from '@/components/InstallationDetails/InstallationDetailsProgress.component';
import { InstallationDetailsError } from '@/components/InstallationDetails/InstallationDetailsError.component';
import { useMockInstallationTaskDetailsOptions } from '@/hooks/installationDetails/useInstallationDetails';
import { SAPInstallationStatus } from '@/types/installation.type';

const REFECTH_INTERVAL_INSTALLATION_STATUS = 30_000;

export default function InstallationDetailsPage() {
  const { serviceName, taskId } = useParams();
  const { t } = useTranslation('dashboard/installation');
  const header = {
    title: t('dashboard_installation_title'),
    description: t('dashboard_installation_description'),
  };

  useQuery({
    ...useMockInstallationTaskDetailsOptions({
      serviceName,
      taskId,
    }),
    refetchInterval(query) {
      if (
        [
          SAPInstallationStatus.pending,
          SAPInstallationStatus.retry,
          SAPInstallationStatus.started,
        ].includes(query.state?.data?.data?.status)
      ) {
        return REFECTH_INTERVAL_INSTALLATION_STATUS;
      }
      return false;
    },
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
