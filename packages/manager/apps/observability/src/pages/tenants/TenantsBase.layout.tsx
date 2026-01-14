import { useTranslation } from 'react-i18next';

import MetricsBaseLayout from '@/pages/metrics/MetricsBase.layout';
import TenantsOutlet from '@/pages/tenants/Tenants.outlet';

export default function TenantsBaseLayout({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation('tenants');
  return (
    <MetricsBaseLayout title={t('listing.title')}>
      {children}
      <TenantsOutlet />
    </MetricsBaseLayout>
  );
}
