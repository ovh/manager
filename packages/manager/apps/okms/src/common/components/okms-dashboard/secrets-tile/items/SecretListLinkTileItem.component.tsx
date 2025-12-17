import { useNavigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

type SecretListLinkTileItemProps = {
  okms: OKMS;
};

export const SecretListLinkTileItem = ({ okms }: SecretListLinkTileItemProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation('key-management-service/common');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('manage_secrets_link')}
        onClickReturn={() => {
          navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okms.id));
          trackClick({
            location: PageLocation.tile,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['secret', 'list'],
          });
        }}
      />
    </ManagerTile.Item>
  );
};
