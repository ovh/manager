import React from 'react';
import { ManagerTile, Clipboard } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import { ENPOINT_LABEL } from '@/constants';
import { DownloadOkmsPublicCaLink } from '@/common/components/downloadOkmsPublicCaLink/DownloadOkmsPublicCaLink';

type RestApiEndpointTileItemProps = {
  okms: OKMS;
};

export const RestApiEndpointTileItem = ({
  okms,
}: RestApiEndpointTileItemProps) => {
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{ENPOINT_LABEL}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex flex-col gap-3">
          <Clipboard value={okms.restEndpoint} />
          <DownloadOkmsPublicCaLink okms={okms} type="publicCaRest" />
        </div>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
