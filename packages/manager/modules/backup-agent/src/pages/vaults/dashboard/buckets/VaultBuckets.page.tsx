import React, { Suspense } from 'react';

import { useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ReloadButton } from '@/components/ReloadButton/ReloadButton.component';
import { queryKeys } from '@/data/queries/queryKeys';
import { vaultsQueries } from '@/data/queries/vaults.queries';
import { selectVaultBuckets } from '@/data/selectors/vaults.selectors';

import { useBucketColumns } from './_hooks/useBucketColumns.hooks';

export default function VaultBucketsPage() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const queryClient = useQueryClient();
  const { data: buckets = [], isPending } = useQuery({
    ...vaultsQueries.withClient(queryClient).detail(vaultId!),
    select: selectVaultBuckets,
  });
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.VAULT_LISTING);
  const columns = useBucketColumns();

  return (
    <Suspense>
      <Datagrid
        topbar={
          <div className="flex justify-end" role="toolbar" aria-label={t('more_action')}>
            <ReloadButton queryKeys={[queryKeys.vaults.detail(vaultId)]} isLoading={isPending} />
          </div>
        }
        columns={columns}
        items={buckets}
        totalItems={buckets.length}
      />
    </Suspense>
  );
}
