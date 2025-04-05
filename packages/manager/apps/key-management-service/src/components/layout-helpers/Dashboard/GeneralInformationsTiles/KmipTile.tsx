import {
  DashboardTile,
  DashboardTileBlockItem,
  Clipboard,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { OKMS } from '@/types/okms.type';
import { KMIP_ENPOINT_LABEL, KMIP_RSA_LABEL } from './KmipTile.constants';
import { DownloadKmsPublicCaLink } from '@/components/dashboard/download-kms-public-ca-link/DownloadKmsPublicCaLink';

type KmipTileProps = {
  okmsData?: OKMS;
};
const KmipTile = ({ okmsData }: KmipTileProps) => {
  const items: DashboardTileBlockItem[] = [
    {
      id: 'kmip',
      label: KMIP_ENPOINT_LABEL,
      value: (
        <div className="flex flex-col gap-2">
          <Clipboard className="block w-full" value={okmsData?.kmipEndpoint} />
          <DownloadKmsPublicCaLink okmsId={okmsData.id} type={'publicCa'} />
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
          <DownloadKmsPublicCaLink okmsId={okmsData.id} type={'publicRsaCa'} />
        </div>
      ),
    });
  }
  return <DashboardTile title="KMIP" items={items} />;
};

export default KmipTile;
