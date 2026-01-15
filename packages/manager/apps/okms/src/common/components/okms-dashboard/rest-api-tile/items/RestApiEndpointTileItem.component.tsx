import { OKMS } from '@key-management-service/types/okms.type';

import { ManagerTile } from '@ovh-ux/manager-react-components';
import { Clipboard } from '@ovh-ux/muk';

import { DownloadOkmsPublicCaLink } from '@/common/components/download-okms-public-ca-link/DownloadOkmsPublicCaLink';
import { ENPOINT_LABEL } from '@/constants';

type RestApiEndpointTileItemProps = {
  okms: OKMS;
};

export const RestApiEndpointTileItem = ({ okms }: RestApiEndpointTileItemProps) => {
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
