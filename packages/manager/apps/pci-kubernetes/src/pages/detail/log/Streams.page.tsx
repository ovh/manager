import { useHref } from 'react-router-dom';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import {
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useLogs } from '@/api/hooks/useDbaasLogs';
import { StreamsList } from './components/StreamsList.component';
import { TDbaasLog } from '@/api/data/dbaas-logs';
import { LOG_LIST_TRACKING_HITS } from './constants';

export default function StreamsPage() {
  const { t } = useTranslation('logs');
  const { t: tCommon } = useTranslation('common');
  const { navigation, tracking } = useContext(ShellContext).shell;
  const backHref = useHref('../logs');
  const { clearNotifications } = useNotifications();
  const [account, setAccount] = useState<TDbaasLog>();
  const { data: dbaasLogs, isPending } = useLogs();

  useEffect(() => {
    setAccount(dbaasLogs?.[0]);
  }, [dbaasLogs]);

  const gotoAddDataStream = async () =>
    navigation
      .getURL(
        'dedicated',
        `#/dbaas/logs/${account?.serviceName}/streams/add`,
        {},
      )
      .then((url: string) => window.open(url, '_blank'));

  if (isPending)
    return (
      <div className="text-center">
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      </div>
    );

  return (
    <>
      <Notifications />
      <div className="mb-6">
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={backHref}
          onClick={() => {
            clearNotifications();
            tracking.trackClick({
              name: LOG_LIST_TRACKING_HITS.GO_BACK,
            });
          }}
        >
          <span slot="start">
            <OsdsIcon
              className="mr-4"
              name={ODS_ICON_NAME.ARROW_LEFT}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.xxs}
            />
          </span>
          {tCommon('common_back_button_back_to_previous_page')}
        </OsdsLink>
      </div>
      <OsdsText
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('logs_list_title')}
      </OsdsText>
      <p>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('logs_list_description_audit')}
        </OsdsText>
      </p>

      <OsdsButton
        className="mt-4"
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.stroked}
        onClick={() => {
          tracking.trackClick({
            name: LOG_LIST_TRACKING_HITS.ADD_DATA_STREAM,
          });
          gotoAddDataStream();
        }}
        inline
      >
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
        {t('logs_list_add_data_stream_button')}
      </OsdsButton>

      {dbaasLogs?.length && (
        <div className="mt-8">
          <OsdsSelect
            className="w-[20rem]"
            value={account?.serviceName}
            onOdsValueChange={(event) =>
              setAccount(
                dbaasLogs.find(
                  ({ serviceName }) => serviceName === `${event.detail.value}`,
                ),
              )
            }
            inline
          >
            {dbaasLogs.map((log) => (
              <OsdsSelectOption value={log.serviceName} key={log.serviceName}>
                {log.displayName || log.serviceName}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
      )}

      {account && (
        <div className="mt-4">
          <StreamsList account={account} />
        </div>
      )}
    </>
  );
}
