import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  ShellContext,
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import React, { useContext, useEffect, useState } from 'react';
import { Service } from '../../data/types/dbaas/logs';
import getServiceLabel from '../../helpers/getServiceLabel';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';
import { LogsActionEnum } from '../../types/logsTracking';

const ServiceLink = ({ service }: { service: Service }) => {
  const [serviceUrl, setServiceUrl] = useState('');
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const goToDetailLogsAccess = useLogTrackingActions(
    LogsActionEnum.go_to_detail_logs_access,
  );
  const { trackClick } = useOvhTracking();

  useEffect(() => {
    navigation
      .getURL('dedicated', `#/dbaas/logs/${service.serviceName}`, {})
      .then(setServiceUrl);
  }, [navigation, service]);

  return (
    <Links
      href={serviceUrl}
      label={getServiceLabel(service)}
      type={LinkType.external}
      target="_blank"
      onClickReturn={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [goToDetailLogsAccess],
        });
      }}
    />
  );
};

export default ServiceLink;
