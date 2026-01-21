import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ReloadButton } from '@/components/ReloadButton/ReloadButton.component';
import { SERVICE_CONSUMPTION_QUERY_KEY } from '@/data/hooks/consumption/useServiceConsumption';
import { BACKUP_VAULTS_LIST_QUERY_KEY, useBackupVaultsList } from '@/data/hooks/vaults/getVault';

import { useColumns } from './_hooks/useBillingListingColumns.hooks';

export default function ListingPage() {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.VAULT_LISTING);
  const { data, isPending } = useBackupVaultsList();
  const columns = useColumns();

  return (
    <Suspense>
      <Datagrid
        topbar={
          <div className="flex justify-end" role="toolbar" aria-label={t('more_action')}>
            <ReloadButton
              isLoading={isPending}
              queryKeys={[BACKUP_VAULTS_LIST_QUERY_KEY, SERVICE_CONSUMPTION_QUERY_KEY]}
            />
          </div>
        }
        columns={columns}
        items={data ?? []}
        totalItems={data?.length ?? 0}
      />
    </Suspense>
  );
}
