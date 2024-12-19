import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCard,
  OdsDivider,
  OdsLink,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useLogsDetails } from '../../api/hook/useLogs';
import { LogHowTo } from './LogHowTo.component';
import { LogContext } from './LogProvider.component';
import { LogTileUnsubscribeAction } from './LogTileUnsubscribeAction.component';

import '../../translations/logs';

export interface LogTilesProps {
  onGotoStreams: () => void;
}

export function LogTiles({ onGotoStreams }: Readonly<LogTilesProps>) {
  const { t } = useTranslation('pci-logs');
  const { tracking } = useContext(ShellContext).shell;
  const { logsApiURL, logsKind, logsTracking } = useContext(LogContext);
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { data: logs, isPending: isLogsPending } = useLogsDetails(
    logsApiURL,
    logsKind,
  );

  if (isLogsPending) {
    return <></>;
  }

  return (
    <>
      {logs?.length === 0 && <LogHowTo onGotoStreams={onGotoStreams} />}
      {logs?.length > 0 && (
        <>
          <OdsText preset="heading-1">
            {t('log_tile_subscriptions_title')}
          </OdsText>
          <OdsButton
            icon={ODS_ICON_NAME.plus}
            label={t('log_tile_subscriptions_subscribe')}
            className="mt-4"
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => {
              clearNotifications();
              onGotoStreams();
            }}
          />
        </>
      )}
      {logs?.map(({ data, log, stream, streamURL }) => (
        <OdsCard key={log?.serviceName + stream?.streamId} className="mt-4">
          <div className="flex flex-col">
            <OdsText className="block" preset="heading-1">
              {t('log_title_subscriptions_title')}
            </OdsText>
            <dl className="grid grid-cols-2">
              <dt className="mb-4">
                <OdsText preset="span" className="font-bold">
                  {data?.displayName || log?.serviceName}
                </OdsText>
              </dt>
              <dd className="text-right">{log?.serviceName}</dd>
              <dt className="mb-4">
                <OdsText preset="span" className="font-bold">
                  {t('log_title_subscriptions_user')}
                </OdsText>
              </dt>
              <dd className="text-right">{data?.username}</dd>
              <dt>
                <OdsText preset="span" className="font-bold">
                  {t('logs_list_title')}
                </OdsText>
              </dt>
              <dd className="text-right">{stream?.title}</dd>
            </dl>
            <OdsDivider color="dark" />
            <OdsLink
              className="text-[14px]"
              label={t('log_title_subscriptions_button_watch')}
              href={streamURL?.address}
              icon={ODS_ICON_NAME.externalLink}
              onClick={() => {
                if (logsTracking?.graylogWatch) {
                  tracking.trackClick({
                    name: logsTracking?.graylogWatch,
                  });
                }
              }}
              target="_blank"
              isDisabled={!!streamURL?.address}
            />
            <LogTileUnsubscribeAction
              subscriptionId={log.subscriptionId}
              onSuccess={() =>
                addSuccess(
                  <Translation ns="pci-logs">
                    {(_t) => _t('logs_list_unsubscription_success')}
                  </Translation>,
                  true,
                )
              }
              onError={(err) =>
                addError(
                  <Translation ns="pci-logs">
                    {(_t) =>
                      _t('error_message', {
                        message:
                          err?.response?.data?.message || err?.message || null,
                      })
                    }
                  </Translation>,
                  true,
                )
              }
            />
          </div>
        </OdsCard>
      ))}
    </>
  );
}
