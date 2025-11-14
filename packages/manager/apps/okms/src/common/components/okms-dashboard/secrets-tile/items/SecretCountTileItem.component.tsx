import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { OKMS } from '@key-management-service/types/okms.type';

type SecretCountTileItemProps = {
  okms: OKMS;
};

export const SecretCountTileItem = ({ okms }: SecretCountTileItemProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{t('okms_secret_count')}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsText preset="span">{okms.secretCount}</OdsText>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
