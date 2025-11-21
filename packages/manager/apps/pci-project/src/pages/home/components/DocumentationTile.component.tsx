import {
  ManagerTile,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { DASHBOARD_DOCUMENTATION_LINKS } from '@/constants';

export default function DocumentationTile() {
  const { t } = useTranslation('home');

  const { trackClick } = useOvhTracking();

  const {
    data: availability,
    isPending: isFeatureAvailabilityPending,
  } = useFeatureAvailability(
    DASHBOARD_DOCUMENTATION_LINKS.map(({ feature }) => feature),
  );

  if (
    DASHBOARD_DOCUMENTATION_LINKS.length === 0 ||
    isFeatureAvailabilityPending
  ) {
    return null;
  }

  return (
    <ManagerTile>
      <ManagerTile.Title>
        {t('pci_projects_home_documentation')}
      </ManagerTile.Title>
      <ManagerTile.Divider />

      {DASHBOARD_DOCUMENTATION_LINKS.filter(
        ({ feature }) => availability?.[feature],
      ).map((item, itemIdx: number) => (
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
                  actions: [item.trackingName],
                });
              }}
            />
          </ManagerTile.Item.Description>
          <ManagerTile.Divider />
        </ManagerTile.Item>
      ))}
    </ManagerTile>
  );
}
