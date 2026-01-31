import { OKMS } from '@key-management-service/types/okms.type';

import { Tile } from '@ovh-ux/muk';

import { KMIP_LABEL } from '@/constants';

import { KmipEndpointRsaTileItem } from './items/KmipEndpointRsaTileItem.component';
import { KmipEndpointTileItem } from './items/KmipEndpointTileItem.component';

type KmipTileProps = {
  okms: OKMS;
};

export const KmipTile = ({ okms }: KmipTileProps) => {
  return (
    <Tile.Root title={KMIP_LABEL}>
      <KmipEndpointTileItem okms={okms} />
      <KmipEndpointRsaTileItem okms={okms} />
    </Tile.Root>
  );
};
