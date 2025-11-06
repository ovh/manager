import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovh-ux/muk';
import { Spinner } from '@ovh-ux/muk';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader.component';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs.component';
import { InformationTile } from '@/components/dashboard/InformationTile.component';
import { ConfigurationTile } from '@/components/dashboard/ConfigurationTile.component';
import { BillingTile } from '@/components/dashboard/BillingTile.component';
import { EolBanner } from '@/components/eol-banner/EolBanner.component';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { data, navigation, isLoading, isError, error } = useDashboardData();

  if (isLoading) {
    return (
      <BaseLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner />
        </div>
      </BaseLayout>
    );
  }

  if (isError || !data) {
    return (
      <BaseLayout>
        <div className="alert alert-danger">
          {t('errors.load_failed')}
          {error && <pre>{String(error)}</pre>}
        </div>
      </BaseLayout>
    );
  }

  const { nasha, serviceInfo, canCreatePartitions, isNashaEolServiceBannerAvailable, shouldReengage, nashaApiUrl } = data;

  return (
    <BaseLayout>
      <DashboardHeader
        nasha={nasha}
        nashaApiUrl={nashaApiUrl}
        onReload={navigation.reload}
      />

      {isNashaEolServiceBannerAvailable && (
        <EolBanner serviceName={nasha.serviceName} />
      )}

      <DashboardTabs serviceName={nasha.serviceName} />

      <div className="nasha-dashboard-general-information">
        <div className="row py-4">
          <div className="col-md-4 col-sm-12">
            <InformationTile
              nasha={nasha}
              onEditName={navigation.goToEditName}
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <ConfigurationTile
              nasha={nasha}
              canCreatePartitions={canCreatePartitions}
              serviceName={nasha.serviceName}
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <BillingTile
              serviceInfo={serviceInfo}
              servicePath={nashaApiUrl}
              withEngagement={data.isCommitmentAvailable}
              shouldReengage={shouldReengage}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

