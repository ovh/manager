import { useTranslation } from 'react-i18next';

import { useRouteTitleKey } from '@/hooks/useRouteTitleKey.hook';
import MetricsResourceBaseLayout from '@/pages/metrics/MetricsResourceBase.layout';

export default function ManagedDashboardLayout() {
  const { t } = useTranslation('managed-dashboards');
  const titleKey = useRouteTitleKey();
  const title = t(`managed-dashboards:${titleKey}`);

  return <MetricsResourceBaseLayout title={title} />;
}
