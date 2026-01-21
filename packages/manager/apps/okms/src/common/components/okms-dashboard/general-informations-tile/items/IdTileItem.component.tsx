import { OKMS } from '@key-management-service/types/okms.type';

import { Clipboard, Tile } from '@ovh-ux/muk';

import { ID_LABEL } from '@/constants';

type IdTileItemProps = {
  okms: OKMS;
};

export const IdTileItem = ({ okms }: IdTileItemProps) => {
  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={ID_LABEL} />
      <Tile.Item.Description>
        <Clipboard value={okms.id} className="w-full" />
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
