import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { COMMUNITY_LINKS } from '@/constants';

export default function CommunityTile() {
  const { t } = useTranslation('home');

  const { trackClick } = useOvhTracking();

  const { environment } = useContext(ShellContext);
  const region = environment.getRegion();
  const isUsRegion = region === 'US';

  if (isUsRegion) {
    return null;
  }

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('pci_projects_home_community')}</ManagerTile.Title>
      <ManagerTile.Divider />

      {COMMUNITY_LINKS.map((item, itemIdx: number) => (
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
                  actions: [
                    PageLocation.page,
                    ButtonType.tutorial,
                    item.trackingName || '',
                  ],
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
