import { useHref, useParams } from 'react-router-dom';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  DbaasLogsAccountSelector,
  StreamsList,
  TDbaasLog,
} from '@ovh-ux/manager-pci-common';
import { LoadBalancerLogsProvider } from './LoadBalancerLogsProvider';

export default function StreamsPage() {
  const { projectId, loadBalancerId, region } = useParams();
  const { t } = useTranslation('logs');
  const { t: tCommon } = useTranslation('pci-common');
  const { navigation } = useContext(ShellContext).shell;
  const backHref = useHref('../logs');
  const { clearNotifications } = useNotifications();
  const [account, setAccount] = useState<TDbaasLog>();

  const gotoAddDataStream = async () =>
    navigation
      .getURL(
        'dedicated',
        `#/dbaas/logs/${account?.serviceName}/streams/add`,
        {},
      )
      .then((url: string) => window.open(url, '_blank'));

  return (
    <LoadBalancerLogsProvider
      loadBalancerId={loadBalancerId}
      projectId={projectId}
      region={region}
    >
      <div className="mb-6">
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={backHref}
          onClick={() => {
            clearNotifications();
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
          {t('octavia_load_balancer_data_streams_description_haproxy')}
        </OsdsText>
      </p>

      <OsdsButton
        className="mt-4"
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.flat}
        onClick={() => {
          gotoAddDataStream();
        }}
        inline
      >
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xxs}
            className="bg-white"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
        {t('logs_list_add_data_stream_button')}
      </OsdsButton>

      <DbaasLogsAccountSelector
        account={account}
        onAccountChange={setAccount}
      />

      {account && (
        <div className="mt-4">
          <StreamsList account={account} serviceName={loadBalancerId} />
        </div>
      )}
    </LoadBalancerLogsProvider>
  );
}
