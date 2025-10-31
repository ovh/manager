import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { OKMS } from '@key-management-service/types/okms.type';
import { SERVICE_KEYS_LABEL } from '@/constants';
import { ServiceKeyCountTileItem } from './items/ServiceKeyCountTileItem.component';
import useProductType from '@/common/hooks/useProductType';
import { ServiceKeyListLinkTileItem } from './items/ServiceKeyListLinkTileItem.component';

type ServiceKeysTileProps = {
  okms: OKMS;
};

export const ServiceKeysTile = ({ okms }: ServiceKeysTileProps) => {
  const productType = useProductType();

  return (
    <ManagerTile>
      <ManagerTile.Title>{SERVICE_KEYS_LABEL}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ServiceKeyCountTileItem okms={okms} />
      {productType === 'secret-manager' && (
        <>
          <ManagerTile.Divider />
          <ServiceKeyListLinkTileItem okms={okms} />
        </>
      )}
    </ManagerTile>
  );
};
