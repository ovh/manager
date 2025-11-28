import { Outlet, useMatches, useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import {
  BaseLayout,
  Breadcrumb,
  ChangelogMenu,
  Notifications,
  TEXT_PRESET,
  Text,
} from '@ovh-ux/muk';

import { AppConfig, CHANGELOG_LINKS, appName } from '@/App.constants';
import MetricsGuideHeader from '@/components/metrics/guide-header/MetricsGuideHeader.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import { LocationPathParams } from '@/routes/Routes.constants';
import { LABELS } from '@/utils/labels.constants';

type RouteHandle = {
  titleKey?: string;
};

export default function TenantLayout() {
  const { t } = useTranslation(['tenants', 'shared']);

  const { selectedService } = useObservabilityServiceContext();
  const { tenantId } = useParams<LocationPathParams>();
  const { data: tenant } = useTenant(selectedService?.id ?? '', tenantId ?? '');
  const matches = useMatches();
  const currentMatch = matches.find((match) => (match.handle as RouteHandle)?.titleKey);
  const titleKey = (currentMatch?.handle as RouteHandle)?.titleKey;
  const title = titleKey
    ? t(`tenants:${titleKey}`)
    : (tenant?.currentState?.title ?? LABELS.TENANT);

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
      <Text preset={TEXT_PRESET.paragraph} className="mb-6">
        <Trans
          t={t}
          i18nKey="shared:service"
          values={{
            serviceName: selectedService?.currentState?.displayName || selectedService?.id,
          }}
        />
      </Text>
      <Outlet />
    </BaseLayout>
  );
}
