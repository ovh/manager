import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Tile } from '@ovh-ux/muk';

type RegionTileItemProps = {
  okms: OKMS;
};

export const RegionTileItem = ({ okms }: RegionTileItemProps) => {
  const { t } = useTranslation(NAMESPACES.REGION);

  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={t('region')} />
      <Tile.Item.Description>
        <Text preset="span">{t(`region_${okms.region}`)}</Text>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
