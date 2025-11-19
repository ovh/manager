import { OKMS } from '@key-management-service/types/okms.type';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { REST_API_LABEL } from '@/constants';

import { RestApiEndpointTileItem } from './items/RestApiEndpointTileItem.component';
import { SwaggerTileItem } from './items/SwaggerTileItem.component';

type RestApiTileProps = {
  okms: OKMS;
};

export const RestApiTile = ({ okms }: RestApiTileProps) => {
  return (
    <ManagerTile>
      <ManagerTile.Title>{REST_API_LABEL}</ManagerTile.Title>
      <ManagerTile.Divider />
      <RestApiEndpointTileItem okms={okms} />
      <ManagerTile.Divider />
      <SwaggerTileItem okms={okms} />
    </ManagerTile>
  );
};
