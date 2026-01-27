import { useNavigate } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Tile } from '@ovh-ux/muk';

import { MukLink, MukLinkType } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { SERVICE_KEYS_TILE_TEST_IDS } from '../ServiceKeysTile.constants';

type ServiceKeyListLinkTileItemProps = {
  okms: OKMS;
};

export const ServiceKeyListLinkTileItem = ({ okms }: ServiceKeyListLinkTileItemProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation('key-management-service/common');

  return (
    <Tile.Item.Root>
      <MukLink
        type={MukLinkType.next}
        data-testid={SERVICE_KEYS_TILE_TEST_IDS.serviceKeyListLink}
        onClick={() => {
          navigate(KMS_ROUTES_URLS.serviceKeyListing(okms.id));
          trackClick({
            location: PageLocation.tile,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['service-key', 'list'],
          });
        }}
      >
        {t('manage_service_keys_link')}
      </MukLink>
    </Tile.Item.Root>
  );
};
