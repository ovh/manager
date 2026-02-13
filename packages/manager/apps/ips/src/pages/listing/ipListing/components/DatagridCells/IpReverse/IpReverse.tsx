import React, { useContext } from 'react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { useGetIcebergIpReverse, useGetIpdetails } from '@/data/hooks/ip';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { useDeleteIpReverse } from '@/data/hooks/ip/useDeleteIpReverse';
import { useUpdateIpReverse } from '@/data/hooks/ip/useUpdateIpReverse';
import { EditInline } from '@/components/EditInline/edit-inline.component';
import { IpReverseError } from '@/components/IpReverseError/IpReverseError';
import { IAM_ACTION } from '@/utils';

export type IpReverseProps = {
  ip: string;
  parentIpGroup?: string;
};

/**
 * Component to display the cell content for IP Reverse
 * If ip is not /32 display nothing
 * If ip has no reverse display "-"
 * If ip has reverse, display the reverse
 * @param ip the ip with mask
 * @param parentIpGroup the parent ip group with mask for ip group child reverse
 * @returns React Component
 */
export const IpReverse = ({ ip, parentIpGroup }: IpReverseProps) => {
  const { expiredIps } = useContext(ListingContext);
  const { addError } = useNotifications();
  const { trackPage } = useOvhTracking();

  // Check if ip is not /32
  const { ip: formattedIp, isGroup } = ipFormatter(ip);
  const ipGroup = parentIpGroup || ip;

  const {
    ipDetails,
    isLoading: ipDetailsLoading,
    error: ipDetailsError,
  } = useGetIpdetails({ ip: ipGroup });

  // Get ip reverse
  const { ipsReverse, isLoading, error } = useGetIcebergIpReverse({
    ip: ipGroup,
    enabled: !isGroup && expiredIps.indexOf(ip) === -1,
  });

  // If there is an error while deleting / updating
  // Add error notification
  const onError = (apiError: ApiError) => {
    addError(
      <React.Suspense fallback={<OdsSpinner />}>
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
      isLoading={
        isLoading || ipDetailsLoading || pendingDelete || pendingUpdate
      }
      enabled={!isGroup}
      error={error || ipDetailsError}
      ip={ip}
    >
      <EditInline
        name={`ip-reverse-${formattedIp}`}
        onConfirm={(newReverse: string) => {
          if (!!ipReverse && newReverse === '') {
            deleteIpReverse();
          } else {
            updateIpReverse({ reverse: newReverse });
          }
        }}
        defaultValue={ipReverse}
        iamActions={[IAM_ACTION.reverseCreate, IAM_ACTION.reverseDelete]}
        urn={ipDetails?.iam?.urn}
      >
        {ipReverse || <>-</>}
      </EditInline>
    </SkeletonCell>
  );
};
