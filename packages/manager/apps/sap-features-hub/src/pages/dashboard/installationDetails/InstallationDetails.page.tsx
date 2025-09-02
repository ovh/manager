import { useHref } from 'react-router-dom';
import {
  BaseLayout,
  HeadersProps,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { InstallationDetailsSummary } from '@/components/InstallationDetails/InstallationDetailsSummary.component';
import { InstallationDetailsProgress } from '@/components/InstallationDetails/InstallationDetailsProgress.component';
import { InstallationDetailsError } from '@/components/InstallationDetails/InstallationDetailsError.component';
import { useInstallationTaskDetailsOptions } from '@/hooks/installationDetails/useInstallationDetails';
import { useWizardAvailability } from '@/hooks/wizardAvailability/useWizardAvailability';
import { SAPInstallationStatus } from '@/types/installation.type';
import { urls } from '@/routes/routes.constant';
import { useSapSearchParams } from '@/hooks/sapSearchParams/useSapSearchParams';

const REFECTH_INTERVAL_INSTALLATION_STATUS = 30_000;

export default function InstallationDetailsPage() {
  const { t } = useTranslation('dashboard/installation');
  const hrefPrevious = useHref(urls.listing);
  const { serviceName, taskId } = useSapSearchParams();
  const { isWizardAvailable, isLoading } = useWizardAvailability();

  const header: HeadersProps = { title: t('dashboard_installation_title') };

  useQuery({
    ...useInstallationTaskDetailsOptions({
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
      <RedirectionGuard
        condition={!isWizardAvailable}
        isLoading={isLoading}
        route={urls.dashboard}
      >
        <BaseLayout
          breadcrumb={<Breadcrumb />}
          header={header}
          backLinkLabel={t('dashboard_installation_go_back_to_list')}
          hrefPrevious={hrefPrevious}
          subtitle={t('dashboard_installation_description')}
        >
          <div className="flex flex-col gap-8">
            <InstallationDetailsError
              serviceName={serviceName}
              taskId={taskId}
            />
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
      </RedirectionGuard>
    </Suspense>
  );
}
