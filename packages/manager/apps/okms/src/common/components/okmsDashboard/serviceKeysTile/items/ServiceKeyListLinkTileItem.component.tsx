import React from 'react';
import { Links, LinkType, ManagerTile } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@key-management-service/types/okms.type';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';

type ServiceKeyListLinkTileItemProps = {
  okms: OKMS;
};

export const ServiceKeyListLinkTileItem = ({
  okms,
}: ServiceKeyListLinkTileItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/common');

  return (
    <ManagerTile.Item>
      <Links
        type={LinkType.next}
        label={t('manage_service_keys_link')}
        onClickReturn={() =>
          navigate(KMS_ROUTES_URLS.serviceKeyListing(okms.id))
        }
      />
    </ManagerTile.Item>
  );
};
