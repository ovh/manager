import React, { Suspense, useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';

import LinkedServersError from '@/components/linked-servers/LinkedServersError/LinkedServersError.component';
import LinkedServersTopbar from '@/components/linked-servers/LinkedServersTopbar/LinkedServersTopbar.component';
import { backupServersQueries } from '@/data/queries/backupServers.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { useBackupLicenseUrn } from '@/hooks/useBackupLicenseUrn/useBackupLicenseUrn';
import { useBackupServersPolling } from '@/hooks/useBackupServersPolling/useBackupServersPolling';
import { useLinkedServersColumns } from '@/hooks/useLinkedServersColumns/useLinkedServersColumns';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

export default function LinkedServersPage() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);
  const queryClient = useQueryClient();
  const columns = useLinkedServersColumns();
  const backupLicenseUrn = useBackupLicenseUrn();

  const listOptions = backupServersQueries.withClient(queryClient).list();

  const { refetchInterval, hasTimedOut, resetPolling } = useBackupServersPolling(
    queryClient.getQueryData(listOptions.queryKey),
  );

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    ...listOptions,
    refetchInterval,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isFetching) setIsRefreshing(false);
  }, [isFetching]);

  const handleRefresh = () => {
    resetPolling();
    setIsRefreshing(true);
    void queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
  };

  const isLoading = isPending || isRefreshing;

  return (
    <section className="flex flex-col gap-4">
      <LinkedServersTopbar isLoading={isLoading} onRefresh={handleRefresh} urn={backupLicenseUrn} />
      {hasTimedOut && (
        <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
          <OdsText>{t('polling.timeout')}</OdsText>
        </OdsMessage>
      )}
      {isError ? (
        <LinkedServersError onRetry={() => void refetch()} />
      ) : (
        <Datagrid
          columns={columns}
          items={data ?? []}
          totalItems={data?.length ?? 0}
          isLoading={isLoading}
          noResultLabel={t('empty_state')}
        />
      )}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </section>
  );
}
