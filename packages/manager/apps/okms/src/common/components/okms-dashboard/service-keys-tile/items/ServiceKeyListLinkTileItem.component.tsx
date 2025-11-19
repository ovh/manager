import { useNavigate } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';

type ServiceKeyListLinkTileItemProps = {
  okms: OKMS;
};

export const ServiceKeyListLinkTileItem = ({ okms }: ServiceKeyListLinkTileItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/common');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('manage_service_keys_link')}
        onClickReturn={() => navigate(KMS_ROUTES_URLS.serviceKeyListing(okms.id))}
      />
    </ManagerTile.Item>
  );
};
