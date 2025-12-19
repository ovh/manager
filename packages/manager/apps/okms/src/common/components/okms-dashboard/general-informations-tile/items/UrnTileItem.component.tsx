import { OKMS } from '@key-management-service/types/okms.type';

import { Clipboard, ManagerTile } from '@ovh-ux/manager-react-components';

import { URN_LABEL } from '@/constants';

type UrnTileItemProps = {
  okms: OKMS;
};

export const UrnTileItem = ({ okms }: UrnTileItemProps) => {
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{URN_LABEL}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <Clipboard value={okms.iam.urn} />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
