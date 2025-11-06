import {
  DashboardTile,
  DashboardTileBlockItem,
  Clipboard,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { OKMS } from '@/types/okms.type';
import { KMIP_ENPOINT_LABEL, KMIP_RSA_LABEL } from './KmipTile.constants';
import { DownloadKmsPublicCaLink } from '@/components/dashboard/downloadKmsPublicCaLink/DownloadKmsPublicCaLink';

type KmipTileProps = {
  okmsData: OKMS;
};
const KmipTile = ({ okmsData }: KmipTileProps) => {
  const items: DashboardTileBlockItem[] = [
    {
      id: 'kmip',
      label: KMIP_ENPOINT_LABEL,
      value: (
        <div className="flex flex-col gap-2">
          <Clipboard className="block w-full" value={okmsData?.kmipEndpoint} />
          <DownloadKmsPublicCaLink okms={okmsData} type={'publicCaKmip'} />
        </div>
      ),
    },
  ];
  if (okmsData?.kmipRsaEndpoint) {
    items.push({
      id: 'kmipRsa',
      label: KMIP_RSA_LABEL,
      value: (
        <div className="flex flex-col gap-2">
          <Clipboard
            className="block w-full"
            value={okmsData.kmipRsaEndpoint}
          />
          <DownloadKmsPublicCaLink okms={okmsData} type={'publicCaRsaKmip'} />
        </div>
      ),
    });
  }
  return <DashboardTile title="KMIP" items={items} />;
};

export default KmipTile;
