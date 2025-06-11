import { useHref, useSearchParams } from 'react-router-dom';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { OdsText } from '@ovhcloud/ods-components/react';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { InstallationDetailsSummary } from '@/components/InstallationDetails/InstallationDetailsSummary.component';
import { InstallationDetailsProgress } from '@/components/InstallationDetails/InstallationDetailsProgress.component';
import { InstallationDetailsError } from '@/components/InstallationDetails/InstallationDetailsError.component';
import { useMockInstallationTaskDetailsOptions } from '@/hooks/installationDetails/useInstallationDetails';
import { SAPInstallationStatus } from '@/types/installation.type';
import { urls } from '@/routes/routes.constant';

const REFECTH_INTERVAL_INSTALLATION_STATUS = 30_000;

export default function InstallationDetailsPage() {
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get('serviceName');
  const taskId = searchParams.get('taskId');
  const hrefPrevious = useHref(urls.listing);

  const { t } = useTranslation('dashboard/installation');
  const header = {
    title: t('dashboard_installation_title'),
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
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={header}
        backLinkLabel={t('dashboard_installation_go_back_to_list')}
        hrefPrevious={hrefPrevious}
      >
        <div className="flex flex-col gap-8">
          <OdsText preset="heading-2">
            {t('dashboard_installation_description')}
          </OdsText>
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
