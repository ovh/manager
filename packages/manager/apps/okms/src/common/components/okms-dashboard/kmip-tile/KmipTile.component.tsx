import { OKMS } from '@key-management-service/types/okms.type';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { KMIP_LABEL } from '@/constants';

import { KmipEndpointRsaTileItem } from './items/KmipEndpointRsaTileItem.component';
import { KmipEndpointTileItem } from './items/KmipEndpointTileItem.component';

type KmipTileProps = {
  okms: OKMS;
};

export const KmipTile = ({ okms }: KmipTileProps) => {
  return (
    <ManagerTile>
      <ManagerTile.Title>{KMIP_LABEL}</ManagerTile.Title>
      <ManagerTile.Divider />
      <KmipEndpointTileItem okms={okms} />
      <ManagerTile.Divider />
      <KmipEndpointRsaTileItem okms={okms} />
    </ManagerTile>
  );
};
