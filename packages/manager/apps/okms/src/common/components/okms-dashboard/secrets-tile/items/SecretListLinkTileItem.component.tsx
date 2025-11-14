import React from 'react';
import { Links, LinkType, ManagerTile } from '@ovh-ux/manager-react-components';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@key-management-service/types/okms.type';

type SecretListLinkTileItemProps = {
  okms: OKMS;
};

export const SecretListLinkTileItem = ({
  okms,
}: SecretListLinkTileItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/common');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('manage_secrets_link')}
        onClickReturn={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okms.id))
        }
      />
    </ManagerTile.Item>
  );
};
