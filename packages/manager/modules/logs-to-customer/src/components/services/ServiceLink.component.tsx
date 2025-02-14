import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { useContext, useEffect, useState } from 'react';
import { Service } from '../../data/types/dbaas/logs';
import getServiceLabel from '../../helpers/getServiceLabel';

const ServiceLink = ({ service }: { service: Service }) => {
  const [serviceUrl, setServiceUrl] = useState('');
  const {
    shell: { navigation },
  } = useContext(ShellContext);

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
    />
  );
};

export default ServiceLink;
