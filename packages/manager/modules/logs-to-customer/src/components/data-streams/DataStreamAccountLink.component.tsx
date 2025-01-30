import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import React, { useContext, useEffect, useState } from 'react';
import { Service } from '../../data/types/dbaas/logs';

const DataStreamAccountLink = ({ service }: { service: Service }) => {
  const [accountURL, setAccountURL] = useState('');
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  useEffect(() => {
    navigation
      .getURL('dedicated', `#/dbaas/logs/${service.serviceName}`, {})
      .then(setAccountURL);
  }, [navigation]);

  return (
    <Links
      href={accountURL}
      label={service.serviceName}
      type={LinkType.external}
      target={OdsHTMLAnchorElementTarget._blank}
    />
  );
};

export default DataStreamAccountLink;
