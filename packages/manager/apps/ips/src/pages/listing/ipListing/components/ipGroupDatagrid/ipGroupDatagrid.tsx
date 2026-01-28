import React from 'react';

import { Row, VisibilityState } from '@tanstack/react-table';

import { Datagrid } from '@ovh-ux/muk';

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
  columnVisibility?: VisibilityState;
};

export const IpGroupDatagrid: React.FC<IpGroupDatagridProps> = ({
  row,
  parentHeaders,
  columnVisibility,
}) => {
  const { ipDetails, loading: isIpDetailsLoading } = useGetIpdetails({
    ip: row.original.ip,
  });

  const { slice, loading: isByoipSliceLoading } = useByoipSlice({
    ip: row.original.ip,
    enabled: !!ipDetails?.bringYourOwnIp,
  });

  const { columns, loading } = useIpGroupDatagridColumns({
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
      data={ipList?.map((ip) => ({ ip })) || []}
      totalCount={ipList?.length}
      hideHeader
      columnVisibility={{ columnVisibility, setColumnVisibility: () => {} }}
      isLoading={
        loading ||
        isIpDetailsLoading ||
        isByoipSliceLoading ||
        isIpReverseLoading
      }
    />
  );
};
