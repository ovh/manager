import { useNotifications } from '@ovhcloud/manager-components';
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
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useKubeLogs } from '@/api/hooks/useLogs';
import { LogHowTo } from './LogHowTo.component';

export interface LogTilesProps {
  projectId: string;
  kubeId: string;
}

export function LogTiles({ projectId, kubeId }: Readonly<LogTilesProps>) {
  const { t } = useTranslation('logs');
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { data: logs, isPending: isLogsPending } = useKubeLogs(
    projectId,
    kubeId,
  );

  if (isLogsPending) return undefined;
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
            {t('log_button_transfer_stream')}
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
            <OsdsButton
              className="mt-4"
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              onClick={null /* @TODO unsubscribe stream */}
            >
              {t('list_button_unsubscribe')}
            </OsdsButton>
          </div>
        </OsdsTile>
      ))}
    </>
  );
}
