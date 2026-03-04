import { useGetIpdetails, useGetIpVmacWithIp } from '@/data/hooks/ip';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ColumnDef } from '@tanstack/react-table';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for IP Vmac
 * No data fetching is done here, just select vmac corresponding to given ip
 * Display rules:
 * If not enabled display nothing
 * If enabled but has no vmac display "-"
 * If enabled and has a vmac for given ip, display the mac address
 * @param ip the ip to check if vmac exist for it
 * @param vmacsWithIp list of all vmacs populate with ips
 * @param enabled to show or not the information
 * @returns React Component
 */
export const IpVmacFilterByIp: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const { ipDetails, loading } = useGetIpdetails({ ip: parentIpGroup || ip });
  const { vmacsWithIp, loading: isVmacsLoading } = useGetIpVmacWithIp({
    serviceName: ipDetails?.routedTo?.serviceName || '',
  });
  const vmac = vmacsWithIp.find((vmacs) =>
    vmacs?.ip?.some((vmacIp) => ip === vmacIp),
  );

  return (
    <SkeletonCell loading={loading || isVmacsLoading} ip={ip}>
      {!vmac ? <>-</> : <div>{vmac.macAddress}</div>}
    </SkeletonCell>
  );
};
