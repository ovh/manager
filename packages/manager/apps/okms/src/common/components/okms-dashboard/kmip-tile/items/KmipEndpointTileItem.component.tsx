import { OKMS } from '@key-management-service/types/okms.type';

import { Clipboard, Tile } from '@ovh-ux/muk';

import { DownloadOkmsPublicCaLink } from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';
import { ENPOINT_LABEL } from '@/constants';

type KmipEndpointTileItemProps = {
  okms: OKMS;
};

export const KmipEndpointTileItem = ({ okms }: KmipEndpointTileItemProps) => {
  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={ENPOINT_LABEL} />
      <Tile.Item.Description>
        <div className="flex flex-col gap-3">
          <Clipboard value={okms.kmipEndpoint} />
          <DownloadOkmsPublicCaLink okms={okms} type="publicCaKmip" />
        </div>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
