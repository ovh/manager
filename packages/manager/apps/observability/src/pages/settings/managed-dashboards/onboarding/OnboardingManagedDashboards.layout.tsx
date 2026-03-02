import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import ServicesDropDown from '@/components/services/dropdown/ServicesDropDown.component';
import MetricsBaseLayout from '@/pages/metrics/MetricsBase.layout';
import { urls } from '@/routes/Routes.constants';

export default function OnboardingManagedDashboardsLayout() {
  const { t } = useTranslation('managed-dashboards');

  const navigate = useNavigate();

  return (
    <MetricsBaseLayout title={t('managed-dashboards:title')}>
      <ServicesDropDown onChange={() => navigate(urls.managedDashboards)} />
      <Outlet />
    </MetricsBaseLayout>
  );
}
