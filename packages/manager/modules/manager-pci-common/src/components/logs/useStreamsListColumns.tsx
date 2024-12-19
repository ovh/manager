import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { TDbaasLog, TDbaasStream } from '../../api/data/dbaas-logs';
import { StreamRetention } from './StreamRetention.component';
import { StreamSubscriptions } from './StreamSubscriptions.component';

import '../../translations/logs';

export interface UseStreamsListColumnsProps {
  account: TDbaasLog;
  serviceName: string;
}

export const useStreamsListColumns = ({
  account,
  serviceName,
}: Readonly<UseStreamsListColumnsProps>) => {
  const { t } = useTranslation('pci-logs');
  const { navigation } = useContext(ShellContext).shell;
  const [accountURL, setAccountURL] = useState('');

  useEffect(() => {
    navigation
      .getURL('dedicated', `#/dbaas/logs/${account?.serviceName}/home`, {})
      .then(setAccountURL);
  }, [account]);

  return [
    {
      id: 'name',
      cell: () => (
        <DataGridTextCell>
          <OdsLink href={accountURL} target="_blank">
            {account.displayName || account.serviceName}
          </OdsLink>
          {account.displayName && (
            <OdsText className="block" preset="caption">
              {account.serviceName}
            </OdsText>
          )}
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
          <OdsBadge
            label={t(`list_indexation_status_${stream.indexingEnabled}`)}
            color={stream.indexingEnabled ? 'success' : 'warning'}
          />
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
            account={account.serviceName}
            serviceName={serviceName}
            streamId={stream.streamId}
            subscriptionCount={stream.nbSubscription}
          />
        </DataGridTextCell>
      ),
      label: t('list_column_stream_subscription'),
    },
  ];
};
