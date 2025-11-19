import { OKMS } from '@key-management-service/types/okms.type';

import { Clipboard, ManagerTile } from '@ovh-ux/manager-react-components';

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
