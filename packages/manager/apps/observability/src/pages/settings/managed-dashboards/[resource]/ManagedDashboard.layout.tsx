import { useTranslation } from 'react-i18next';

import MetricsResourceBaseLayout from '@/pages/metrics/MetricsResourceBase.layout';

export default function ManagedDashboardLayout() {
  const { t } = useTranslation('managed-dashboards');
  return <MetricsResourceBaseLayout title={t('managed-dashboards:creation.title')} />;
}
