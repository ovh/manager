import React from 'react';
import { ManagerTile, Clipboard } from '@ovh-ux/manager-react-components';
import { OKMS } from '@key-management-service/types/okms.type';
import { ENPOINT_LABEL } from '@/constants';
import { DownloadOkmsPublicCaLink } from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';

type KmipEndpointTileItemProps = {
  okms: OKMS;
};

export const KmipEndpointTileItem = ({ okms }: KmipEndpointTileItemProps) => {
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{ENPOINT_LABEL}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex flex-col gap-3">
          <Clipboard value={okms.kmipEndpoint} />
          <DownloadOkmsPublicCaLink okms={okms} type="publicCaKmip" />
        </div>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
