import React from 'react';
import { Links, LinkType, ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';

type EditSecretConfigTileItemProps = { okms: OKMS };

export const EditSecretConfigLinkTileItem = ({
  okms,
}: EditSecretConfigTileItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('edit_metadata')}
        onClickReturn={() =>
          navigate(
            SECRET_MANAGER_ROUTES_URLS.okmsUpdateSecretConfigDrawer(okms.id),
          )
        }
      />
    </ManagerTile.Item>
  );
};
