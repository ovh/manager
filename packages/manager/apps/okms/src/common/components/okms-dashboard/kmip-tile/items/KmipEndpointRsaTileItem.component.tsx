import { OKMS } from '@key-management-service/types/okms.type';

import { Clipboard, Tile } from '@ovh-ux/muk';

import { DownloadOkmsPublicCaLink } from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';
import { ENDPOINT_RSA_LABEL } from '@/constants';

type KmipEndpointRsaTileItemProps = {
  okms: OKMS;
};

export const KmipEndpointRsaTileItem = ({ okms }: KmipEndpointRsaTileItemProps) => {
  return (
    <Tile.Item.Root>
      <Tile.Item.Term label={ENDPOINT_RSA_LABEL} />
      <Tile.Item.Description divider={false}>
        <div className="flex flex-col gap-3">
          <Clipboard value={okms.kmipRsaEndpoint} />
          <DownloadOkmsPublicCaLink okms={okms} type="publicCaRsaKmip" />
        </div>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
