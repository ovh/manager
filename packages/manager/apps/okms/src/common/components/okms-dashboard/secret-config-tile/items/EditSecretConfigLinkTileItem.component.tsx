import { useNavigate } from 'react-router-dom';

import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

type EditSecretConfigTileItemProps = { okms: OKMS };

export const EditSecretConfigLinkTileItem = ({ okms }: EditSecretConfigTileItemProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation('secret-manager');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('edit_metadata')}
        onClickReturn={() => {
          navigate(SECRET_MANAGER_ROUTES_URLS.okmsUpdateSecretConfigDrawer(okms.id));
          trackClick({
            location: PageLocation.tile,
            buttonType: ButtonType.link,
            actionType: 'action',
            actions: ['edit', 'secret-config'],
          });
        }}
      />
    </ManagerTile.Item>
  );
};
