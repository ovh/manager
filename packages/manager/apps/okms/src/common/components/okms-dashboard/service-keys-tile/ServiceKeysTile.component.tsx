import { OKMS } from '@key-management-service/types/okms.type';

import { Tile } from '@ovh-ux/muk';

import { useProductType } from '@/common/hooks/useProductType';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { ServiceKeyCountTileItem } from './items/ServiceKeyCountTileItem.component';
import { ServiceKeyListLinkTileItem } from './items/ServiceKeyListLinkTileItem.component';

type ServiceKeysTileProps = {
  okms: OKMS;
};

export const ServiceKeysTile = ({ okms }: ServiceKeysTileProps) => {
  const productType = useProductType();

  return (
    <Tile.Root title={SERVICE_KEYS_LABEL}>
      <ServiceKeyCountTileItem okms={okms} divider={productType === 'secret-manager'} />
      {productType === 'secret-manager' && <ServiceKeyListLinkTileItem okms={okms} />}
    </Tile.Root>
  );
};
