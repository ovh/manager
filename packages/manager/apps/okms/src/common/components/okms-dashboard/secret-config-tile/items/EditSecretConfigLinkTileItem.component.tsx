import { useNavigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';

type EditSecretConfigTileItemProps = { okms: OKMS };

export const EditSecretConfigLinkTileItem = ({ okms }: EditSecretConfigTileItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('edit_metadata')}
        onClickReturn={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.okmsUpdateSecretConfigDrawer(okms.id))
        }
      />
    </ManagerTile.Item>
  );
};
