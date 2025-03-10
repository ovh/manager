import React, { useState, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { useGetIpdetails } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { getLinkByServiceName } from '@/utils';

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

  const { ipDetails, isLoading } = useGetIpdetails({ ip });

  useEffect(() => {
    getLinkByServiceName({
      serviceName: ipDetails?.routedTo?.serviceName,
      navigation: shell.navigation,
    }).then(setServiceUrl);
  }, [ipDetails]);

  return (
    <SkeletonCell isLoading={isLoading}>
      {!ipDetails?.routedTo?.serviceName && <>-</>}
      {ipDetails?.routedTo?.serviceName && (
        <>
          {serviceUrl ? (
            <OdsLink
              href={serviceUrl}
              color={ODS_LINK_COLOR.primary}
              label={ipDetails.routedTo.serviceName}
            />
          ) : (
            ipDetails.routedTo.serviceName
          )}
        </>
      )}
    </SkeletonCell>
  );
};
