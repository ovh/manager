import React from 'react';
import { ManagerTile, Clipboard } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import { ENDPOINT_RSA_LABEL } from '@/constants';
import { DownloadOkmsPublicCaLink } from '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink';

type KmipEndpointRsaTileItemProps = {
  okms: OKMS;
};

export const KmipEndpointRsaTileItem = ({
  okms,
}: KmipEndpointRsaTileItemProps) => {
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
