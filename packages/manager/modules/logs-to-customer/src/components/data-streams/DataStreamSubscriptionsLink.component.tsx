import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { useContext, useEffect, useState } from 'react';
import { Service, Stream } from '../../data/types/dbaas/logs';

type TDataStreamSubscriptionsLink = Pick<
  Stream,
  'nbSubscription' | 'streamId'
> &
  Pick<Service, 'serviceName'>;

const DataStreamSubscriptionsLink = ({
  nbSubscription,
  serviceName,
  streamId,
}: TDataStreamSubscriptionsLink) => {
  const [subscriptionsURL, setSubscriptionsURL] = useState('');
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  useEffect(() => {
    navigation
      .getURL(
        'dedicated',
        `#/dbaas/logs/${serviceName}/streams/${streamId}/subscriptions`,
        {},
      )
      .then(setSubscriptionsURL);
  }, [navigation]);

  return (
    <Links
      href={subscriptionsURL}
      label={nbSubscription.toString()}
      type={LinkType.external}
      target="_blank"
    />
  );
};

export default DataStreamSubscriptionsLink;
