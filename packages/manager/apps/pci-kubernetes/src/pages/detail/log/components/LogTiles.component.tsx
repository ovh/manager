import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useKubeLogs } from '@/api/hooks/useLogs';
import { LogHowTo } from './LogHowTo.component';
import { LogTileUnsubscribeAction } from './LogTileUnsubscribeAction';
import { LOG_TRACKING_HITS } from '../constants';

export interface LogTilesProps {
  projectId: string;
  kubeId: string;
}

export function LogTiles({ projectId, kubeId }: Readonly<LogTilesProps>) {
  const { t } = useTranslation('logs');
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { data: logs, isPending: isLogsPending } = useKubeLogs(
    projectId,
    kubeId,
  );

  if (isLogsPending) {
    return <></>;
  }

  return (
    <>
      {logs?.length === 0 && <LogHowTo />}
      {logs?.length > 0 && (
        <>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_TEXT_SIZE._300}
          >
            {t('log_tile_subscriptions_title')}
          </OsdsText>
          <OsdsButton
            className="mt-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            onClick={() => {
              clearNotifications();
              navigate('./streams');
            }}
          >
            <span slot="start">
              <OsdsIcon
                name={ODS_ICON_NAME.ADD}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </span>
            {t('log_tile_subscriptions_subscribe')}
          </OsdsButton>
        </>
      )}
      {logs?.map(({ data, log, stream, streamURL }) => (
        <OsdsTile
          key={log?.serviceName + stream?.streamId}
          className="mt-4"
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          <div className="flex flex-col">
            <OsdsText
              className="block"
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
            >
              {t('log_title_subscriptions_title')}
            </OsdsText>
            <dl className="grid grid-cols-2">
              <dt className="mb-4">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_TEXT_SIZE._500}
                >
                  {data?.displayName || log?.serviceName}
                </OsdsText>
              </dt>
              <dd className="text-right">{log?.serviceName}</dd>
              <dt className="mb-4">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_TEXT_SIZE._500}
                >
                  {t('log_title_subscriptions_user')}
                </OsdsText>
              </dt>
              <dd className="text-right">{data?.username}</dd>
              <dt>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_TEXT_SIZE._500}
                >
                  {t('logs_list_title')}
                </OsdsText>
              </dt>
              <dd className="text-right">{stream?.title}</dd>
            </dl>
            <OsdsDivider color={ODS_THEME_COLOR_INTENT.primary} separator />
            <OsdsButton
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              href={streamURL?.address}
              onClick={() =>
                tracking.trackClick({
                  name: LOG_TRACKING_HITS.GRAYLOG_WATCH,
                })
              }
              target={OdsHTMLAnchorElementTarget._blank}
              disabled={streamURL?.address ? undefined : true}
            >
              {t('log_title_subscriptions_button_watch')}
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
            </OsdsButton>
            <LogTileUnsubscribeAction
              projectId={projectId}
              kubeId={kubeId}
              subscriptionId={log.subscriptionId}
              onSuccess={() =>
                addSuccess(
                  <Translation ns="logs">
                    {(_t) => _t('logs_list_unsubscription_success')}
                  </Translation>,
                  true,
                )
              }
              onError={(err) =>
                addError(
                  <Translation ns="logs">
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
        </OsdsTile>
      ))}
    </>
  );
}
