import React, { useContext, useEffect, useState } from 'react';
import { useTranslation, Translation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useSubscriptions,
  useCreateSubscription,
  useRemoveSubscription,
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
        `#/dbaas/logs/${serviceName}/streams/${streamId}/subscriptions`,
        {},
      )
      .then(setSubscriptionsURL);
  }, []);

  if (isPending) return <OsdsSkeleton />;
  return (
    <div className="flex justify-between items-center min-w-[14rem]">
      {subscriptionCount > 0 ? (
        <OsdsLink
          className="mr-4"
          color={ODS_THEME_COLOR_INTENT.primary}
          href={subscriptionsURL}
          onClick={() => {
            if (logsTracking?.ldpDetails) {
              tracking.trackClick({
                name: logsTracking?.ldpDetails,
              });
            }
          }}
          target={OdsHTMLAnchorElementTarget._blank}
        >
          {subscriptionCount}
          <span slot="end">
            <OsdsIcon
              aria-hidden="true"
              className="ml-4"
              name={ODS_ICON_NAME.EXTERNAL_LINK}
              hoverable
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
        </OsdsLink>
      ) : (
        '-'
      )}
      {currentSubscription && (
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
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
          disabled={isRemovePending ? true : undefined}
          inline
        >
          {t('list_button_unsubscribe')}
          {isRemovePending && (
            <span slot="start">
              <OsdsSpinner className="mt-3" size={ODS_SPINNER_SIZE.sm} inline />
            </span>
          )}
        </OsdsButton>
      )}
      {!currentSubscription && (
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
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
          disabled={isCreationPending ? true : undefined}
          inline
        >
          {t('list_button_subscribe')}
          {isCreationPending && (
            <span slot="start">
              <OsdsSpinner className="mt-3" size={ODS_SPINNER_SIZE.sm} inline />
            </span>
          )}
        </OsdsButton>
      )}
    </div>
  );
}
