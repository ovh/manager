import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { ManagerTile } from '@ovh-ux/manager-react-components';

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
