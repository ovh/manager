import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

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
    <ManagerTile>
      <ManagerTile.Title>{t('general_information')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <NameTileItem okms={okms} />
      <ManagerTile.Divider />
      <RegionTileItem okms={okms} />
      <ManagerTile.Divider />
      <IdTileItem okms={okms} />
      <ManagerTile.Divider />
      <UrnTileItem okms={okms} />
    </ManagerTile>
  );
};
