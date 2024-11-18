import React, { useState, useEffect } from 'react';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import {
  useGetIpdetails,
  useMoveIpTasks,
  useVrackMoveTasks,
} from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { getLinkByServiceName, getTypeByServiceName } from '@/utils';
import { IpTypeEnum } from '@/data/constants';

export type IpAttachedServiceProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Attached service
 * If ip has no attached services display "-"
 * If ip has attached service, we display it as a link if possible
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpAttachedService = ({ ip }: IpAttachedServiceProps) => {
  const { shell } = React.useContext(ShellContext);
  const [serviceUrl, setServiceUrl] = useState<string>();
  const { trackClick } = useOvhTracking();

  const { ipDetails, isLoading } = useGetIpdetails({ ip });
  const { isVrackTasksLoading, hasOnGoingVrackMoveTasks } = useVrackMoveTasks({
    ip,
    serviceName: ipDetails?.routedTo?.serviceName,
  });
  const { hasOnGoingMoveIpTask, isTasksLoading } = useMoveIpTasks({
    ip,
    enabled:
      !!ipDetails?.routedTo?.serviceName &&
      getTypeByServiceName(ipDetails.routedTo.serviceName) !== IpTypeEnum.VRACK,
  });

  useEffect(() => {
    getLinkByServiceName({
      serviceName: ipDetails?.routedTo?.serviceName,
      navigation: shell.navigation,
    }).then(setServiceUrl);
  }, [ipDetails]);

  return (
    <SkeletonCell
      isLoading={
        isLoading ||
        isTasksLoading ||
        isVrackTasksLoading ||
        hasOnGoingMoveIpTask ||
        hasOnGoingVrackMoveTasks
      }
    >
      {ipDetails?.routedTo?.serviceName ? (
        <>
          {serviceUrl ? (
            <OdsLink
              target="_blank"
              href={serviceUrl}
              color={ODS_LINK_COLOR.primary}
              label={ipDetails.routedTo.serviceName}
              onClick={() => {
                trackClick({
                  location: PageLocation.datagrid,
                  buttonType: ButtonType.link,
                  actionType: 'action',
                  actions: ['details_attached-service'],
                });
              }}
            />
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
