import React from 'react';

import { Row } from '@tanstack/react-table';

import { Datagrid } from '@ovh-ux/manager-react-components';

import {
  useByoipSlice,
  useGetIcebergIpReverse,
  useGetIpdetails,
} from '@/data/hooks/ip';
import { getIpv4SubIpList, isValidIpv6Block } from '@/utils';

import {
  isAntiDdosAvailable,
  isGameFirewallAvailable,
} from '../DatagridCells/enableCellsUtils';
import { useIpGroupDatagridColumns } from './useIpGroupDatagridColumns';

type IpGroupDatagridProps = {
  row: Row<{ ip: string }>;
  parentHeaders?: React.MutableRefObject<Record<string, HTMLTableCellElement>>;
};

export const IpGroupDatagrid: React.FC<IpGroupDatagridProps> = ({
  row,
  parentHeaders,
}) => {
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({
    ip: row.original.ip,
  });

  const { slice, isLoading: isByoipSliceLoading } = useByoipSlice({
    ip: row.original.ip,
    enabled: !!ipDetails?.bringYourOwnIp,
  });

  const { columns, isLoading } = useIpGroupDatagridColumns({
    parentIp: row.original.ip,
    parentHeaders,
    serviceName: ipDetails?.routedTo?.serviceName,
    isAntiDdosAvailable: isAntiDdosAvailable(ipDetails),
    isGameFirewallAvailable: isGameFirewallAvailable(ipDetails),
    isByoipSlice: isIpDetailsLoading || !!ipDetails?.bringYourOwnIp,
  });

  const {
    ipsReverse: ipReverseList,
    isLoading: isIpReverseLoading,
  } = useGetIcebergIpReverse({
    ip: row.original.ip,
    enabled: isValidIpv6Block(row.original.ip),
  });

  const ipList = React.useMemo(() => {
    if (ipDetails?.bringYourOwnIp) {
      return (
        slice
          ?.find(({ slicingSize }) => slicingSize === 32)
          ?.childrenIps || []).map((ip) => ip.replace('/32', '')
      );
    }

    return isValidIpv6Block(row.original.ip)
      ? ipReverseList?.map((ip) => ip.ipReverse) || []
      : getIpv4SubIpList(row.original.ip);
  }, [ipDetails, slice, ipReverseList, row.original.ip]);

  return (
    <Datagrid
      columns={columns}
      items={ipList}
      totalItems={ipList?.length}
      hideHeader
      tableLayoutFixed
      isLoading={
        isLoading ||
        isIpDetailsLoading ||
        isByoipSliceLoading ||
        isIpReverseLoading
      }
      numberOfLoadingRows={1}
    />
  );
};
