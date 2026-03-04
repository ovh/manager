import { useContext } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import {
  useGetIpMitigationWithoutIceberg,
  useGetIpdetails,
} from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import { ipFormatter } from '@/utils/ipFormatter';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpRowData, isAntiDdosAvailable } from '../enableCellsUtils';
import { IpAntiDdosDisplay } from './IpAntiDdosDisplay';

/**
 * Component to display the cell content for Anti DDOS.
 * On this component only data fetching is done. Display is managed by IPAntiDdosDisplay component
 * Display rules:
 * If ip is not /32 (isGroup = true) or not ipv4, we display nothing.
 * If ip mitigation is Permanent we display permanent
 * If ip mitigation is Auto, we display In Action
 * If ip mitigation has no mitigation, we display automatic
 * If mitigation state is not "ok", we display pending
 * @param ip the ip with mask
 * @returns React component
 */
export const IpAntiDdos: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const ipToFetch = parentIpGroup || ip;

  const { expiredIps } = useContext(ListingContext);

  // Check if ip is not a group
  const { isGroup } = ipFormatter(ipToFetch);

  // Get ip details
  const { ipDetails, loading: isDetailsLoading } = useGetIpdetails({
    ip: ipToFetch,
    enabled: !isGroup,
  });

  // get ip mitigation only if ip is ipv4
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isDetailsLoading &&
    isAntiDdosAvailable(ipDetails);

  const { ipMitigation, loading, error } = useGetIpMitigationWithoutIceberg({
    ip: ipToFetch,
    enabled,
  });

  return (
    <SkeletonCell
      loading={loading || isDetailsLoading}
      enabled={!isGroup}
      error={error}
      ip={ip}
    >
      <IpAntiDdosDisplay ipMitigation={ipMitigation} enabled={enabled} />
    </SkeletonCell>
  );
};
