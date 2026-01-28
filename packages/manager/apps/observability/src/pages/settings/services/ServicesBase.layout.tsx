import { useTranslation } from 'react-i18next';

import MetricsGuideHeader from '@/components/metrics/guide-header/MetricsGuideHeader.component';
import ObsBaseLayout from '@/pages/ObsBase.layout';
import ServicesOutlet from '@/pages/settings/services/Services.outlet';

export default function ServicesBaseLayout({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation('services');
  return (
    <ObsBaseLayout
      title={t('services:dashboard.title')}
      guideMenu={<MetricsGuideHeader />} // TODO: add guide menu for settings/services
    >
      {children}
      <ServicesOutlet />
    </ObsBaseLayout>
  );
}
