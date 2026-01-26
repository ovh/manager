import React, { useContext } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Spinner } from '@ovhcloud/ods-react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { EditInline } from '@/components/EditInline/edit-inline.component';
import { IpReverseError } from '@/components/IpReverseError/IpReverseError';
import { useGetIcebergIpReverse } from '@/data/hooks/ip';
import { useDeleteIpReverse } from '@/data/hooks/ip/useDeleteIpReverse';
import { useUpdateIpReverse } from '@/data/hooks/ip/useUpdateIpReverse';
import { ListingContext } from '@/pages/listing/listingContext';
import { ipFormatter } from '@/utils/ipFormatter';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for IP Reverse
 * If ip is not /32 display nothing
 * If ip has no reverse display "-"
 * If ip has reverse, display the reverse
 * @param ip the ip with mask
 * @param parentIpGroup the parent ip group with mask for ip group child reverse
 * @returns React Component
 */
export const IpReverse: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const { expiredIps } = useContext(ListingContext);
  const { addError } = useNotifications();
  const { trackPage } = useOvhTracking();

  // Check if ip is not /32
  const { ip: formattedIp, isGroup } = ipFormatter(ip);
  const ipGroup = parentIpGroup || ip;

  // Get ip reverse
  const { ipsReverse, isLoading, error } = useGetIcebergIpReverse({
    ip: ipGroup,
    enabled: !isGroup && expiredIps.indexOf(ip) === -1,
  });

  // If there is an error while deleting / updating
  // Add error notification
  const onError = (apiError: ApiError) => {
    addError(
      <React.Suspense fallback={<Spinner />}>
        <IpReverseError apiError={apiError} />
      </React.Suspense>,
      true,
    );
    trackPage({
      pageType: PageType.bannerError,
      pageName: 'update_reverse-dns_error',
    });
  };

  // Prepare delete mutation with
  // ip: single Ip with mask (ipFormatter remove mask if /32)
  // ipGroup: the parent group for Ip (if /32 ipGroup is same as Ip but with the mask)
  const {
    mutate: deleteIpReverse,
    isPending: pendingDelete,
  } = useDeleteIpReverse({
    ip: ipGroup,
    ipReverse: formattedIp,
    onError,
  });

  // Prepare update mutation with
  // ip: single Ip with mask (ipFormatter remove mask if /32)
  // ipGroup: the parent group for Ip (if /32 ipGroup is same as Ip but with the mask)
  const {
    mutate: updateIpReverse,
    isPending: pendingUpdate,
  } = useUpdateIpReverse({
    ip: ipGroup,
    ipReverse: formattedIp,
    onError,
  });

  // Find reverse for ip in list of reverse.
  // Especialy usefull for ipBlock as getIpReverse get all reverse for the block.
  const ipReverse = ipsReverse?.find(
    (ipWithReverse) => ipWithReverse.ipReverse === formattedIp,
  )?.reverse;

  return (
    <SkeletonCell
      loading={isLoading || pendingDelete || pendingUpdate}
      enabled={!isGroup}
      error={error}
      ip={ip}
    >
      <EditInline
        name="test"
        onConfirm={(newReverse: string) => {
          if (!!ipReverse && newReverse === '') {
            deleteIpReverse();
          } else {
            updateIpReverse({ reverse: newReverse });
          }
        }}
        defaultValue={ipReverse}
        maxWidth={100}
      >
        {ipReverse || <>-</>}
      </EditInline>
    </SkeletonCell>
  );
};
