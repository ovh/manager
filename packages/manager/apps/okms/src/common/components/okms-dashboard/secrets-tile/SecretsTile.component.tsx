import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Tile } from '@ovh-ux/muk';

import { useProductType } from '@/common/hooks/useProductType';

import { SecretCountTileItem } from './items/SecretCountTileItem.component';
import { SecretListLinkTileItem } from './items/SecretListLinkTileItem.component';
import { SecretVersionCountTileItem } from './items/SecretVersionCountTileItem.component';

type SecretsTileProps = {
  okms: OKMS;
};

export const SecretsTile = ({ okms }: SecretsTileProps) => {
  const { t } = useTranslation('key-management-service/listing');

  const productType = useProductType();

  return (
    <Tile.Root title={t('key_management_service_listing_secret_cell')}>
      <SecretCountTileItem okms={okms} />
      <SecretVersionCountTileItem okms={okms} divider={productType === 'key-management-service'} />
      {productType === 'key-management-service' && <SecretListLinkTileItem okms={okms} />}
    </Tile.Root>
  );
};
