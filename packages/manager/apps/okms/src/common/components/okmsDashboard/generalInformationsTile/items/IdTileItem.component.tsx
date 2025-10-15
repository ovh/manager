import React from 'react';
import { ManagerTile, Clipboard } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import { ID_LABEL } from '@/constants';

type IdTileItemProps = {
  okms: OKMS;
};

export const IdTileItem = ({ okms }: IdTileItemProps) => {
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{ID_LABEL}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <Clipboard value={okms.id} />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
