import { useTranslation } from 'react-i18next';

import { BaseLayout, Breadcrumb, ChangelogMenu, Notifications } from '@ovh-ux/muk';

import { AppConfig, CHANGELOG_LINKS, appName } from '@/App.constants';
import MetricsGuideHeader from '@/components/metrics/guide-header/MetricsGuideHeader.component';
import TenantsOutlet from '@/pages/tenants/Tenants.outlet';

export default function TenantsBaseLayout({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation('tenants');
  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} hideRootLabel={true} />
      }
      header={{
        title: t('listing.title'),
        guideMenu: <MetricsGuideHeader />,
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
      message={<Notifications />}
    >
      <>
        {children}
        <TenantsOutlet />
      </>
    </BaseLayout>
  );
}
