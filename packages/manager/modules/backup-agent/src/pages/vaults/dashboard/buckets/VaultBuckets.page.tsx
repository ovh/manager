import React, { Suspense } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ReloadButton } from '@/components/ReloadButton/ReloadButton.component';
import {
  BACKUP_VAULT_DETAILS_QUERY_KEY,
  useBackupVaultDetails,
} from '@/data/hooks/vaults/getVaultDetails';

import { useBucketColumns } from './_hooks/useBucketColumns.hooks';

export default function VaultBucketsPage() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { data: vaultResource, isLoading } = useBackupVaultDetails({ vaultId: vaultId! });
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.VAULT_LISTING);
  const columns = useBucketColumns();

  return (
    <Suspense>
      <Datagrid
        topbar={
          <div className="flex justify-end" role="toolbar" aria-label={t('more_action')}>
            <ReloadButton
              queryKeys={[BACKUP_VAULT_DETAILS_QUERY_KEY(vaultId)]}
              isLoading={isLoading}
            />
          </div>
        }
        columns={columns}
        items={vaultResource?.currentState.buckets ?? []}
        totalItems={vaultResource?.currentState.buckets.length ?? 0}
      />
    </Suspense>
  );
}
