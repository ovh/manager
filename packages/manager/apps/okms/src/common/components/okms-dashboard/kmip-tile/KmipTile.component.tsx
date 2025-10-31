import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { OKMS } from '@key-management-service/types/okms.type';
import { KMIP_LABEL } from '@/constants';
import { KmipEndpointTileItem } from './items/KmipEndpointTileItem.component';
import { KmipEndpointRsaTileItem } from './items/KmipEndpointRsaTileItem.component';

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
