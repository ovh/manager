import React, { Suspense } from 'react';

import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import {
  BACKUP_VAULT_DETAILS_QUERY_KEY,
  useBackupVaultDetails,
} from '@/data/hooks/vaults/getVaultDetails';

import { useBucketColumns } from './_hooks/useBucketColumns.hooks';

export default function VaultBucketsPage() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { data: vaultResource, isLoading } = useBackupVaultDetails({ vaultId: vaultId! });
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_LISTING, NAMESPACES.ACTIONS]);
  const queryClient = useQueryClient();
  const columns = useBucketColumns();

  const reloadDatagrid = () =>
    queryClient.invalidateQueries({ queryKey: BACKUP_VAULT_DETAILS_QUERY_KEY(vaultId ?? '') });

  return (
    <Suspense>
      <Datagrid
        topbar={
          <div className="flex justify-end" role="toolbar" aria-label={t('more_action')}>
            <OdsButton
              icon="refresh"
              color="primary"
              onClick={void reloadDatagrid}
              isLoading={isLoading}
              variant="outline"
              data-arialabel={t(`${NAMESPACES.ACTIONS}:refresh`)}
              label=""
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
