import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { ManagerTile } from '@ovh-ux/manager-react-components';

type ServiceKeyCountTileItemProps = {
  okms: OKMS;
};

export const ServiceKeyCountTileItem = ({ okms }: ServiceKeyCountTileItemProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{t('okms_service_key_count')}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsText preset="span">{okms.serviceKeyCount}</OdsText>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
