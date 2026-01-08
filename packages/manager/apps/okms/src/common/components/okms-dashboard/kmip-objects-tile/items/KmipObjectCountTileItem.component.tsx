import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

type KmipObjectCountTileItemProps = {
  okms: OKMS;
};

export const KmipObjectCountTileItem = ({ okms }: KmipObjectCountTileItemProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <Tile.Item.Root>
      <Tile.Item.Term
        label={t('okms_kmip_object_count')}
        tooltip={t('okms_kmip_object_count_tooltip')}
      />
      <Tile.Item.Description divider={false}>
        <Text preset="span">{okms.kmipObjectCount}</Text>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
