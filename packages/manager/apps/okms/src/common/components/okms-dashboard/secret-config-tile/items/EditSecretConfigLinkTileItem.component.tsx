import { useNavigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Tile } from '@ovh-ux/muk';

import { MukLink, MukLinkType } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { SECRET_CONFIG_TILE_TEST_IDS } from '../SecretConfigTile.constants';

type EditSecretConfigTileItemProps = { okms: OKMS };

export const EditSecretConfigLinkTileItem = ({ okms }: EditSecretConfigTileItemProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation('secret-manager');

  return (
    <Tile.Item.Root>
      <MukLink
        type={MukLinkType.next}
        data-testid={SECRET_CONFIG_TILE_TEST_IDS.editSecretConfigLink}
        onClick={() => {
          navigate(SECRET_MANAGER_ROUTES_URLS.okmsUpdateSecretConfigDrawer(okms.id));
          trackClick({
            location: PageLocation.tile,
            buttonType: ButtonType.link,
            actionType: 'action',
            actions: ['edit', 'secret-config'],
          });
        }}
      >
        {t('edit_metadata')}
      </MukLink>
    </Tile.Item.Root>
  );
};
