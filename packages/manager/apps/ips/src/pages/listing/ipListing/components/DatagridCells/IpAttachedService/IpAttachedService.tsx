import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Link } from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { IpTypeEnum } from '@/data/constants';
import {
  useGetIpdetails,
  useMoveIpTasks,
  useVrackMoveTasks,
} from '@/data/hooks/ip';
import { getLinkByServiceName, getTypeByServiceName } from '@/utils';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for IP Attached service
 * If ip has no attached services display "-"
 * If ip has attached service, we display it as a link if possible
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpAttachedService: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const ipToFetch = parentIpGroup || ip;
  const { shell } = React.useContext(ShellContext);
  const [serviceUrl, setServiceUrl] = useState<string>();
  const { trackClick } = useOvhTracking();

  const { ipDetails, loading } = useGetIpdetails({ ip: ipToFetch });
  const { isVrackTasksLoading, hasOnGoingVrackMoveTasks } = useVrackMoveTasks({
    ip: ipToFetch,
    serviceName: ipDetails?.routedTo?.serviceName,
  });
  const { hasOnGoingMoveIpTask, isTasksLoading } = useMoveIpTasks({
    ip: ipToFetch,
    enabled:
      !!ipDetails?.routedTo?.serviceName &&
      getTypeByServiceName(ipDetails.routedTo.serviceName) !== IpTypeEnum.VRACK,
  });

  useEffect(() => {
    getLinkByServiceName({
      serviceName: ipDetails?.routedTo?.serviceName,
      navigation: shell.navigation,
    })
      .then(setServiceUrl)
      .catch(() => setServiceUrl(undefined));
  }, [ipDetails]);

  return (
    <SkeletonCell
      loading={
        loading ||
        isTasksLoading ||
        isVrackTasksLoading ||
        hasOnGoingMoveIpTask ||
        hasOnGoingVrackMoveTasks
      }
    >
      {ipDetails?.routedTo?.serviceName ? (
        <>
          {serviceUrl ? (
            <Link
              target="_blank"
              href={serviceUrl}
              onClick={() => {
                trackClick({
                  location: PageLocation.datagrid,
                  buttonType: ButtonType.link,
                  actionType: 'action',
                  actions: ['details_attached-service'],
                });
              }}
            >
              {ipDetails.routedTo.serviceName}
            </Link>
          ) : (
            ipDetails.routedTo.serviceName
          )}
        </>
      ) : (
        <>-</>
      )}
    </SkeletonCell>
  );
};
