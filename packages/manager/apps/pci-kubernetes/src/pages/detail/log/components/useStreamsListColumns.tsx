import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovhcloud/manager-components';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { OsdsChip, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { TDbaasLog, TDbaasStream } from '@/api/data/dbaas-logs';
import { StreamRetention } from './StreamRetention.component';
import { StreamSubscriptions } from './StreamSubscriptions.component';

export const useStreamsListColumns = (account: TDbaasLog) => {
  const { t } = useTranslation('logs');
  const { navigation } = useContext(ShellContext).shell;
  const [accountURL, setAccountURL] = useState('');

  useEffect(() => {
    navigation
      .getURL('dedicated', `#/dbaas/logs/${account?.serviceName}/home`, {})
      .then(setAccountURL);
  }, []);

  return [
    {
      id: 'name',
      cell: () => (
        <DataGridTextCell>
          {account.displayName && (
            <>
              <OsdsLink
                color={ODS_THEME_COLOR_INTENT.primary}
                href={accountURL}
                target={OdsHTMLAnchorElementTarget._blank}
              >
                {account.displayName}
              </OsdsLink>
              <OsdsText className="block" level={ODS_TEXT_LEVEL.caption}>
                {account.serviceName}
              </OsdsText>
            </>
          )}
          {!account.displayName && account.serviceName}
        </DataGridTextCell>
      ),
      label: t('list_column_account'),
    },
    {
      id: 'title',
      cell: (stream: TDbaasStream) => (
        <DataGridTextCell>{stream.title}</DataGridTextCell>
      ),
      label: t('list_column_stream_name'),
    },
    {
      id: 'description',
      cell: (stream: TDbaasStream) => (
        <DataGridTextCell>{stream.description}</DataGridTextCell>
      ),
      label: t('list_column_stream_description'),
    },
    {
      id: 'indexation',
      cell: (stream: TDbaasStream) => (
        <DataGridTextCell>
          <OsdsChip
            color={
              ODS_THEME_COLOR_INTENT[
                stream.indexingEnabled ? 'success' : 'warning'
              ]
            }
            inline
          >
            {t(`list_indexation_status_${stream.indexingEnabled}`)}
          </OsdsChip>
        </DataGridTextCell>
      ),
      label: t('list_column_stream_indexation'),
    },
    {
      id: 'retention',
      cell: (stream: TDbaasStream) => (
        <DataGridTextCell>
          <StreamRetention
            serviceName={account.serviceName}
            clusterId={stream.clusterId}
            retentionId={stream.retentionId}
          />
        </DataGridTextCell>
      ),
      label: t('list_column_stream_retention'),
    },
    {
      id: 'subscriptions',
      cell: (stream: TDbaasStream) => (
        <DataGridTextCell>
          <StreamSubscriptions
            serviceName={account.serviceName}
            streamId={stream.streamId}
            subscriptionCount={stream.nbSubscription}
          />
        </DataGridTextCell>
      ),
      label: t('list_column_stream_subscription'),
    },
  ];
};
