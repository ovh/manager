import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Tile } from '@ovh-ux/muk';

import { KmipObjectCountTileItem } from './items/KmipObjectCountTileItem.component';

type KmipObjectsTileProps = {
  okms: OKMS;
};

export const KmipObjectsTile = ({ okms }: KmipObjectsTileProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <Tile.Root title={t('kmip_objects')}>
      <KmipObjectCountTileItem okms={okms} />
    </Tile.Root>
  );
};
