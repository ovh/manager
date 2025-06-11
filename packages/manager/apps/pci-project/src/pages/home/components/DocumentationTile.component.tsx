import { OdsLink } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile, useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { DASHBOARD_DOCUMENTATION_LINKS } from '@/constants';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

export default function DocumentationTile() {
  const { t } = useTranslation([
    'home',
    NAMESPACES.RESOURCES,
    NAMESPACES.BILLING,
    NAMESPACES.ONBOARDING,
  ]);

  const { trackClick } = useOvhTracking();

  const { data: availability, isPending: isFeatureAvailabilityPending } = useFeatureAvailability(
    DASHBOARD_DOCUMENTATION_LINKS.map(({ feature }) => feature),
  );

  if (DASHBOARD_DOCUMENTATION_LINKS.length === 0 || isFeatureAvailabilityPending) {
    return null;
  }

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('documentation', { ns: NAMESPACES.RESOURCES })}</ManagerTile.Title>
      <ManagerTile.Divider />

      {DASHBOARD_DOCUMENTATION_LINKS.filter(({ feature }) => availability?.[feature]).map(
        (item, itemIdx: number) => (
          <ManagerTile.Item key={itemIdx}>
            <ManagerTile.Item.Label>{t(item.term)}</ManagerTile.Item.Label>
            <ManagerTile.Item.Description>
              <OdsLink
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                label={t(item.description)}
                onClick={() => {
                  trackClick({
                    actionType: 'action',
                    actions: [PageLocation.page, ButtonType.tutorial, item.trackingName || ''],
                  });
                }}
              />
            </ManagerTile.Item.Description>
            <ManagerTile.Divider />
          </ManagerTile.Item>
        ),
      )}
    </ManagerTile>
  );
}
