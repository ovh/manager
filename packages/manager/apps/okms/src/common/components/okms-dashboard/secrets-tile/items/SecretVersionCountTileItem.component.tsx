import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { ManagerTile } from '@ovh-ux/manager-react-components';

type SecretVersionCountTileItemProps = {
  okms: OKMS;
};

export const SecretVersionCountTileItem = ({ okms }: SecretVersionCountTileItemProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{t('okms_secret_version_count')}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsText preset="span">{okms.secretVersionCount}</OdsText>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
