import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsLink,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import {
  useCreateSubscription,
  useRemoveSubscription,
  useSubscriptions,
} from '../../api/hook/useDbaasLogs';
import { LogContext } from './LogProvider.component';

import '../../translations/logs';

export interface StreamSubscriptionsProps {
  account: string;
  serviceName: string;
  streamId: string;
  subscriptionCount: number;
}

export function StreamSubscriptions({
  account,
  serviceName,
  streamId,
  subscriptionCount,
}: Readonly<StreamSubscriptionsProps>) {
  const { t } = useTranslation('pci-logs');
  const { tracking } = useContext(ShellContext).shell;
  const { logsApiURL, logsKind, logsTracking } = useContext(LogContext);
  const { data, isPending } = useSubscriptions(account, streamId);
  const subscriptions = data?.filter(({ kind }) => kind === logsKind);
  const { navigation } = useContext(ShellContext).shell;
  const [subscriptionsURL, setSubscriptionsURL] = useState('');
  const { addError, addSuccess } = useNotifications();

  const { create, isPending: isCreationPending } = useCreateSubscription({
    logsApiURL,
    logsKind,
    streamId,
    onSuccess: () =>
      addSuccess(
        <Translation ns="pci-logs">
          {(_t) => _t('logs_list_subscription_success')}
        </Translation>,
        true,
      ),
    onError: (err: ApiError) =>
      addError(
        <Translation ns="pci-logs">
          {(_t) =>
            _t('error_message', {
              message: err?.response?.data?.message || err?.message || null,
            })
          }
        </Translation>,
        true,
      ),
  });

  const { remove, isPending: isRemovePending } = useRemoveSubscription({
    logsApiURL,
    onSuccess: () =>
      addSuccess(
        <Translation ns="pci-logs">
          {(_t) => _t('logs_list_unsubscription_success')}
        </Translation>,
        true,
      ),
    onError: (err: ApiError) =>
      addError(
        <Translation ns="pci-logs">
          {(_t) =>
            _t('error_message', {
              message: err?.response?.data?.message || err?.message || null,
            })
          }
        </Translation>,
        true,
      ),
  });

  const currentSubscription = subscriptions?.find(
    ({ resource }) => resource.name === serviceName,
  );

  useEffect(() => {
    navigation
      .getURL(
        'dedicated',
        `#/dbaas/logs/${account}/streams/${streamId}/subscriptions`,
        {},
      )
      .then(setSubscriptionsURL);
  }, []);

  if (isPending) return <OdsSkeleton />;
  return (
    <div className="flex justify-between items-center min-w-[14rem]">
      {subscriptionCount > 0 ? (
        <OdsLink
          className="mr-4 text-[--ods-color-primary-500] text-[16px]"
          href={subscriptionsURL}
          onClick={() => {
            if (logsTracking?.ldpDetails) {
              tracking.trackClick({
                name: logsTracking?.ldpDetails,
              });
            }
          }}
          label={subscriptionCount.toString()}
          icon={ODS_ICON_NAME.externalLink}
          target="_blank"
        />
      ) : (
        '-'
      )}
      {currentSubscription && (
        <OdsButton
          label={t('list_button_unsubscribe')}
          size={ODS_BUTTON_SIZE.sm}
          isLoading={isRemovePending}
          onClick={() => {
            if (!isRemovePending) {
              remove(currentSubscription.subscriptionId);
              if (logsTracking?.unsubscribe) {
                tracking.trackClick({
                  name: logsTracking?.unsubscribe,
                });
              }
            }
          }}
          isDisabled={isRemovePending}
        />
      )}
      {!currentSubscription && (
        <OdsButton
          label={t('list_button_subscribe')}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            if (!isCreationPending) {
              create();
              if (logsTracking?.subscribe) {
                tracking.trackClick({
                  name: logsTracking?.subscribe,
                });
              }
            }
          }}
          isLoading={isCreationPending}
          isDisabled={isCreationPending}
        />
      )}
    </div>
  );
}
