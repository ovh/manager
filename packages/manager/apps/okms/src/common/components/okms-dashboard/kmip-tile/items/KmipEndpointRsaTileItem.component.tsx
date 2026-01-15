import { OKMS } from '@key-management-service/types/okms.type';

import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Clipboard } from '@ovh-ux/muk';

import { DownloadOkmsPublicCaLink } from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';
import { ENDPOINT_RSA_LABEL } from '@/constants';

type KmipEndpointRsaTileItemProps = {
  okms: OKMS;
};

export const KmipEndpointRsaTileItem = ({ okms }: KmipEndpointRsaTileItemProps) => {
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{ENDPOINT_RSA_LABEL}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex flex-col gap-3">
          <Clipboard value={okms.kmipRsaEndpoint} />
          <DownloadOkmsPublicCaLink okms={okms} type="publicCaRsaKmip" />
        </div>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
