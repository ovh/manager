import { useTranslation } from 'react-i18next';

import MetricsGuideHeader from '@/components/metrics/guide-header/MetricsGuideHeader.component';
import ServicesNavigation from '@/components/services/navigation/ServicesNavigation.component';
import ObsBaseLayout from '@/pages/ObsBase.layout';
import { urls } from '@/routes/Routes.constants';

export default function ManagedDashboardsBaseLayout({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation('managed-dashboards');
  return (
    <ObsBaseLayout
      title={t('managed-dashboards:title')}
      guideMenu={<MetricsGuideHeader />} // TODO: add guide menu for settings/services
    >
      {children}
      <ServicesNavigation rootUrl={urls.managedDashboards} />
    </ObsBaseLayout>
  );
}
