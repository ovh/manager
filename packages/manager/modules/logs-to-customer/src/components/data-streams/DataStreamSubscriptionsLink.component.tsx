import React, { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { LinkType, Links } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { Service, Stream } from '../../data/types/dbaas/logs';

type TDataStreamSubscriptionsLink = Pick<Stream, 'nbSubscription' | 'streamId' | 'parentStreamId'> &
  Pick<Service, 'serviceName'>;

const DataStreamSubscriptionsLink = ({
  nbSubscription,
  serviceName,
  streamId,
  parentStreamId,
}: TDataStreamSubscriptionsLink) => {
  const { t } = useTranslation('logStreams');
  const [subscriptionsURL, setSubscriptionsURL] = useState('');
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  const isSubStream = !!parentStreamId;

  useEffect(() => {
    navigation
      .getURL('dedicated', `#/dbaas/logs/${serviceName}/streams/${streamId}/subscriptions`, {})
      .then((url) => setSubscriptionsURL(url as string));
  }, [navigation, serviceName, streamId]);

  return (
    <>
      <OdsText preset="span" id={isSubStream ? `popover-${streamId}` : undefined}>
        <Links
          data-testid="link-testStream"
          href={subscriptionsURL}
          label={nbSubscription.toString()}
          type={LinkType.external}
          target="_blank"
          isDisabled={isSubStream}
        />
      </OdsText>
      {isSubStream && (
        <OdsTooltip
          data-testid="popover-testStream"
          triggerId={`popover-${streamId}`}
          className="p-2 bg-gray-100 text-black"
        >
          {t('log_streams_subscription_disabled_tooltip')}
        </OdsTooltip>
      )}
    </>
  );
};

export default DataStreamSubscriptionsLink;
