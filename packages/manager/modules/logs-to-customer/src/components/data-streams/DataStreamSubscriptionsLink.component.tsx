import React, { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ICON_NAME,
  Icon,
  Link,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import { Service, Stream } from '@/data/types/dbaas/logs/Logs.type';

type TDataStreamSubscriptionsLink = Pick<Stream, 'nbSubscription' | 'streamId' | 'parentStreamId'> &
  Pick<Service, 'serviceName'>;

const DataStreamSubscriptionsLink = ({
  nbSubscription = 0,
  serviceName,
  streamId,
  parentStreamId,
}: TDataStreamSubscriptionsLink) => {
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
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

  if (isSubStream) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Text preset="span">
            <Link data-testid="link-testStream" href={subscriptionsURL} target="_blank" disabled>
              {nbSubscription.toString()}
              <Icon name={ICON_NAME.externalLink} />
            </Link>
          </Text>
        </TooltipTrigger>
        <TooltipContent data-testid="popover-testStream">
          {t('log_streams_subscription_disabled_tooltip')}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Text preset="span">
      <Link data-testid="link-testStream" href={subscriptionsURL} target="_blank">
        {nbSubscription.toString()}
        <Icon name={ICON_NAME.externalLink} />
      </Link>
    </Text>
  );
};

export default DataStreamSubscriptionsLink;
