import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { formatIpList } from '@/utils/formatIpList/formatIpList';

interface ServerIpsCellProps {
  /** IP en notation CIDR renvoyées par l'API. */
  ips?: string[];
}

/** Colonnes « IP publique » et « IP privée » : toutes les IP configurées, jointes par « , ». */
export default function ServerIpsCell({ ips }: ServerIpsCellProps) {
  return <DataGridTextCell>{formatIpList(ips)}</DataGridTextCell>;
}
