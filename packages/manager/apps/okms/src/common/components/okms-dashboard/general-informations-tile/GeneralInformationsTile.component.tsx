import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Tile } from '@ovh-ux/muk';

import { IdTileItem } from './items/IdTileItem.component';
import { NameTileItem } from './items/NameTileItem.component';
import { RegionTileItem } from './items/RegionTileItem.component';
import { UrnTileItem } from './items/UrnTileItem.component';

type GeneralInformationsTileProps = {
  okms: OKMS;
};

export const GeneralInformationsTile = ({ okms }: GeneralInformationsTileProps) => {
  const { t } = useTranslation(NAMESPACES.DASHBOARD);

  return (
    <Tile.Root title={t('general_information')}>
      <NameTileItem okms={okms} />
      <RegionTileItem okms={okms} />
      <IdTileItem okms={okms} />
      <UrnTileItem okms={okms} />
    </Tile.Root>
  );
};
