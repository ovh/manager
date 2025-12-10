import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { ManagerTile } from '@ovh-ux/manager-react-components';

type KmipObjectCountTileItemProps = {
  okms: OKMS;
};

export const KmipObjectCountTileItem = ({ okms }: KmipObjectCountTileItemProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label tooltip={t('okms_kmip_object_count_tooltip')}>
        {t('okms_kmip_object_count')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsText preset="span">{okms.kmipObjectCount}</OdsText>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
