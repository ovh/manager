import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

type RegionTileItemProps = {
  okms: OKMS;
};

export const RegionTileItem = ({ okms }: RegionTileItemProps) => {
  const { t } = useTranslation(NAMESPACES.REGION);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{t('region')}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsText preset="span">{t(`region_${okms.region}`)}</OdsText>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
