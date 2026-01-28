import { OKMS } from '@key-management-service/types/okms.type';

import { Clipboard, Tile } from '@ovh-ux/muk';

import { URN_LABEL } from '@/constants';

type UrnTileItemProps = {
  okms: OKMS;
};

export const UrnTileItem = ({ okms }: UrnTileItemProps) => {
  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={URN_LABEL} />
      <Tile.Item.Description divider={false}>
        <Clipboard value={okms.iam.urn} className="w-full" />
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
