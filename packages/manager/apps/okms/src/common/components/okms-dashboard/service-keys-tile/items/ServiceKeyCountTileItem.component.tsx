import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

type ServiceKeyCountTileItemProps = {
  okms: OKMS;
  divider?: boolean;
};

export const ServiceKeyCountTileItem = ({ okms, divider = true }: ServiceKeyCountTileItemProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={t('okms_service_key_count')} />
      <Tile.Item.Description divider={divider}>
        <Text preset="span">{okms.serviceKeyCount}</Text>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
