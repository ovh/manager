import { OKMS } from '@key-management-service/types/okms.type';

import { Clipboard, Tile } from '@ovh-ux/muk';

import { DownloadOkmsPublicCaLink } from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';
import { ENPOINT_LABEL } from '@/constants';

type RestApiEndpointTileItemProps = {
  okms: OKMS;
};

export const RestApiEndpointTileItem = ({ okms }: RestApiEndpointTileItemProps) => {
  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={ENPOINT_LABEL} />
      <Tile.Item.Description>
        <div className="flex flex-col gap-3">
          <Clipboard value={okms.restEndpoint} />
          <DownloadOkmsPublicCaLink okms={okms} type="publicCaRest" />
        </div>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
