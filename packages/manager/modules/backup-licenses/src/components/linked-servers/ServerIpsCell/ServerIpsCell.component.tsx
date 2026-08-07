import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { formatServerIps } from '@/utils/formatIpList/formatIpList';

interface ServerIpsCellProps {
  /** IP publiques, en notation CIDR renvoyées par l'API. */
  externalIps?: string[];
  /** IP privées, en notation CIDR renvoyées par l'API. */
  privateIps?: string[];
}

/** Colonne « IP » fusionnant IP publique et IP privée : `public - private`. */
export default function ServerIpsCell({ externalIps, privateIps }: ServerIpsCellProps) {
  return <DataGridTextCell>{formatServerIps(externalIps, privateIps)}</DataGridTextCell>;
}
