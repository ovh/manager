import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import MetricsBaseLayout from '@/pages/metrics/MetricsBase.layout';

export default function OnboardingManagedDashboardsLayout() {
  const { t } = useTranslation('managed-dashboards');
  return (
    <MetricsBaseLayout title={t('managed-dashboards:title')}>
      <Outlet />
    </MetricsBaseLayout>
  );
}
