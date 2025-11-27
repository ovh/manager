import { Outlet, useMatches } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout, Breadcrumb, ChangelogMenu, Notifications } from '@ovh-ux/muk';

import { AppConfig, CHANGELOG_LINKS, appName } from '@/App.constants';
import MetricsGuideHeader from '@/components/metrics/guide-header/MetricsGuideHeader.component';
import { LABELS } from '@/utils/labels.constants';

type RouteHandle = {
  titleKey?: string;
};

export default function TenantLayout() {
  const { t } = useTranslation('tenants');
  const matches = useMatches();
  const currentMatch = matches.find((match) => (match.handle as RouteHandle)?.titleKey);
  const titleKey = (currentMatch?.handle as RouteHandle)?.titleKey;
  const title = titleKey ? t(titleKey) : LABELS.TENANT;

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} hideRootLabel={true} />
      }
      header={{
        title,
        guideMenu: <MetricsGuideHeader />,
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
      message={<Notifications />}
    >
      <Outlet />
    </BaseLayout>
  );
}
