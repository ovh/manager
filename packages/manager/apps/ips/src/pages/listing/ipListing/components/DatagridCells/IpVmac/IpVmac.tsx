import { useContext } from 'react';

import { useGetIpVmacWithIp, useGetIpdetails } from '@/data/hooks';
import { ListingContext } from '@/pages/listing/listingContext';
import { ipFormatter } from '@/utils/ipFormatter';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpRowData, isVmacAvailable } from '../enableCellsUtils';
import { ColumnDef } from '@tanstack/react-table';

/**
 * Component to display the cell content for IP Vmac
 * On this component only data fetching is done. Display is managed by IpVmacDisplay component
 * Display rules:
 * If ip is not /32 display nothing
 * If ip is not routed to a dedicated server display nothing
 * If ip is /32 and linked to a dedicated server but has no vmac display "-"
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpVmac: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const { expiredIps } = useContext(ListingContext);
  // Check if ip is a group
  const { isGroup } = ipFormatter(ip);

  // check if ip is routed to a dedicated server
  const { ipDetails, loading: isIpDetailsLoading } = useGetIpdetails({
    ip: ip || parentIpGroup,
  });

  // not expired and additionnal / dedicated Ip linked to a dedicated server
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isIpDetailsLoading &&
    isVmacAvailable(ipDetails);

  // get vmacs if ip is routed to a dedicated server
  const serviceName = ipDetails?.routedTo?.serviceName;
  const { vmacsWithIp, loading } = useGetIpVmacWithIp({
    serviceName,
    enabled,
  });

  if (parentIpGroup) {
    const vmac = vmacsWithIp.find((vmacs) =>
      vmacs?.ip?.some((vmacIp) => ip === vmacIp),
    );

    return (
      <SkeletonCell loading={loading} ip={ip}>
        {!vmac ? <>-</> : <div>{vmac.macAddress}</div>}
      </SkeletonCell>
    );
  }

  return (
    <SkeletonCell
      loading={loading || isIpDetailsLoading}
      enabled={!isGroup}
      ip={ip}
    >
      {!enabled && <></>}
      {enabled && !vmacsWithIp?.length && <>-</>}
      {enabled &&
        vmacsWithIp
          ?.filter((vmac) => vmac.ip?.includes(ipFormatter(ip).ip))
          .map((vmac) => <div key={vmac.macAddress}>{vmac.macAddress}</div>)}
    </SkeletonCell>
  );
};
