import {
  DashboardTile,
  DashboardTileBlockItem,
  Clipboard,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { OKMS } from '@/types/okms.type';
import { KMIP_ENPOINT_LABEL, KMIP_RSA_LABEL } from './KmipTile.constants';

type KmipTileProps = {
  okmsData?: OKMS;
};
const KmipTile = ({ okmsData }: KmipTileProps) => {
  const items: DashboardTileBlockItem[] = [
    {
      id: 'kmip',
      label: KMIP_ENPOINT_LABEL,
      value: (
        <Clipboard className="block w-full" value={okmsData?.kmipEndpoint} />
      ),
    },
  ];
  if (okmsData?.kmipRsaEndpoint) {
    items.push({
      id: 'kmipRsa',
      label: KMIP_RSA_LABEL,
      value: (
        <Clipboard className="block w-full" value={okmsData.kmipRsaEndpoint} />
      ),
    });
  }
  return <DashboardTile title="KMIP" items={items} />;
};

export default KmipTile;
