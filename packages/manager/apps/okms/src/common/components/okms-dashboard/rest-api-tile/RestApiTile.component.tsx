import { OKMS } from '@key-management-service/types/okms.type';

import { Tile } from '@ovh-ux/muk';

import { REST_API_LABEL } from '@/constants';

import { RestApiEndpointTileItem } from './items/RestApiEndpointTileItem.component';
import { SwaggerTileItem } from './items/SwaggerTileItem.component';

type RestApiTileProps = {
  okms: OKMS;
};

export const RestApiTile = ({ okms }: RestApiTileProps) => {
  return (
    <Tile.Root title={REST_API_LABEL}>
      <RestApiEndpointTileItem okms={okms} />
      <SwaggerTileItem okms={okms} />
    </Tile.Root>
  );
};
