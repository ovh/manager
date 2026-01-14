import MetricsGuideHeader from '@/components/metrics/guide-header/MetricsGuideHeader.component';
import ObsBaseLayout, { ObsBaseLayoutProps } from '@/pages/ObsBase.layout';

export default function MetricsBaseLayout({ children, title }: ObsBaseLayoutProps) {
  return (
    <ObsBaseLayout title={title} guideMenu={<MetricsGuideHeader />}>
      {children}
    </ObsBaseLayout>
  );
}
