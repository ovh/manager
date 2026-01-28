import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Tile } from '@ovh-ux/muk';

import { GENERAL_INFORMATIONS_TILE_TEST_IDS } from '../GeneralInformationsTile.constants';

type RegionTileItemProps = {
  okms: OKMS;
};

export const RegionTileItem = ({ okms }: RegionTileItemProps) => {
  const { t } = useTranslation(NAMESPACES.REGION);

  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={t('region')} />
      <Tile.Item.Description>
        <Text preset="span" data-testid={GENERAL_INFORMATIONS_TILE_TEST_IDS.region}>
          {t(`region_${okms.region}`)}
        </Text>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
