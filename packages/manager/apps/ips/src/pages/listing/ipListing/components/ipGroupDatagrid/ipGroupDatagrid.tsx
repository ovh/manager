import { Datagrid } from '@ovh-ux/manager-react-components';
import React from 'react';
import { Row } from '@tanstack/react-table';
import {
  useByoipSlice,
  useGetIcebergIpReverse,
  useGetIpdetails,
} from '@/data/hooks/ip';
import { useIpGroupDatagridColumns } from './useIpGroupDatagridColumns';
import {
  isAntiDdosAvailable,
  isGameFirewallAvailable,
} from '../DatagridCells/enableCellsUtils';

type IpGroupDatagridProps = {
  row: Row<{ ip: string }>;
  parentHeaders: React.MutableRefObject<Record<string, HTMLTableCellElement>>;
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
  } = useGetIcebergIpReverse({ ip: row.original.ip });

  const ipList = React.useMemo(
    () =>
      ipDetails?.bringYourOwnIp
        ? slice?.find(({ slicingSize }) => slicingSize === 32)?.childrenIps ||
          []
        : ipReverseList?.map((ip) => ip.ipReverse) || [],
    [ipDetails, slice, ipReverseList],
  );

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
        isIpReverseLoading ||
        isByoipSliceLoading
      }
      numberOfLoadingRows={1}
    />
  );
};
