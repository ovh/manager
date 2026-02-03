import { useNavigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Tile } from '@ovh-ux/muk';

import { MukLink, MukLinkType } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

type SecretListLinkTileItemProps = {
  okms: OKMS;
};

export const SecretListLinkTileItem = ({ okms }: SecretListLinkTileItemProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation('key-management-service/common');

  return (
    <Tile.Item.Root>
      <MukLink
        type={MukLinkType.next}
        onClick={() => {
          navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okms.id));
          trackClick({
            location: PageLocation.tile,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['secret', 'list'],
          });
        }}
      >
        {t('manage_secrets_link')}
      </MukLink>
    </Tile.Item.Root>
  );
};
