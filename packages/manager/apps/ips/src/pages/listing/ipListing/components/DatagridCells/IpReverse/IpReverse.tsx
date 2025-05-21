import React, { useContext } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGetIpReverse } from '@/data/hooks/ip';
import { ipFormatter } from '@/utils/ipFormatter';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';
import { useDeleteIpReverse } from '@/data/hooks/ip/useDeleteIpReverse';
import { useUpdateIpReverse } from '@/data/hooks/ip/useUpdateIpReverse';
import { EditInline } from '@/components/EditInline/edit-inline.component';

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

  // Check if ip is not /32
  const { ip: formattedIp, isGroup } = ipFormatter(ip);
  const ipGroup = parentIpGroup || ip;

  // Get ip reverse
  const { ipsReverse, isLoading, error } = useGetIpReverse({
    ip: ipGroup,
    enabled: !isGroup && expiredIps.indexOf(ip) === -1,
  });

  // If there is an error while deleting / updating
  // Add error notification
  const onError = (apiError: ApiError) => {
    addError(
      <Translation ns="error">
        {(_t) => (
          <span
            dangerouslySetInnerHTML={{
              __html: _t('managerApiError', {
                error:
                  apiError?.response?.data?.message ||
                  apiError?.message ||
                  null,
                ovhQueryId: apiError?.response?.headers?.['x-ovh-queryid'],
              }),
            }}
          />
        )}
      </Translation>,
      true,
    );
  };

  // Prepare delete mutation with
  // ip: single Ip with mask (ipFormatter remove mask if /32)
  // ipGroup: the parent group for Ip (if /32 ipGroup is same as Ip but with the mask)
  const {
    mutate: deleteIpReverse,
    isPending: pendingDelete,
  } = useDeleteIpReverse({
    ip: formattedIp,
    ipGroup,
    onError,
  });

  // Prepare update mutation with
  // ip: single Ip with mask (ipFormatter remove mask if /32)
  // ipGroup: the parent group for Ip (if /32 ipGroup is same as Ip but with the mask)
  const {
    mutate: updateIpReverse,
    isPending: pendingUpdate,
  } = useUpdateIpReverse({
    ip: formattedIp,
    ipGroup,
    onError,
  });

  // Find reverse for ip in list of reverse.
  // Especialy usefull for ipBlock as getIpReverse get all reverse for the block.
  const ipReverse = ipsReverse?.find(
    (ipWithReverse) => ipWithReverse.ipReverse === formattedIp,
  )?.reverse;

  const editIpReverse = (oldReverse: string, newReverse: string) => {
    if (!!oldReverse && newReverse === '') {
      // delete
      deleteIpReverse();
    } else {
      // update
      updateIpReverse({ reverse: newReverse });
    }
  };

  return (
    <SkeletonCell
      isLoading={isLoading || pendingDelete || pendingUpdate}
      enabled={!isGroup}
      error={error}
    >
      <EditInline
        name="test"
        onConfirm={(newReverse: string) => editIpReverse(ipReverse, newReverse)}
        defaultValue={ipReverse}
      >
        {ipReverse || <>-</>}
      </EditInline>
    </SkeletonCell>
  );
};
