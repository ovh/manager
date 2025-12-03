import { useNavigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';

type SecretListLinkTileItemProps = {
  okms: OKMS;
};

export const SecretListLinkTileItem = ({ okms }: SecretListLinkTileItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/common');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('manage_secrets_link')}
        onClickReturn={() => navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okms.id))}
      />
    </ManagerTile.Item>
  );
};
