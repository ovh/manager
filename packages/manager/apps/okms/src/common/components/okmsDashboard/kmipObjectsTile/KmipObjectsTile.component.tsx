import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OKMS } from '@/types/okms.type';
import { KmipObjectCountTileItem } from './items/KmipObjectCountTileItem.component';

type KmipObjectsTileProps = {
  okms: OKMS;
};

export const KmipObjectsTile = ({ okms }: KmipObjectsTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('kmip_objects')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <KmipObjectCountTileItem okms={okms} />
    </ManagerTile>
  );
};
