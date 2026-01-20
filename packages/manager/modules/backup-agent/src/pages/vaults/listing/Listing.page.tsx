import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { BACKUP_VAULTS_LIST_QUERY_KEY, useBackupVaultsList } from '@/data/hooks/vaults/getVault';

import { useColumns } from './_hooks/useColumns.hooks';

export default function ListingPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_LISTING, NAMESPACES.ACTIONS]);
  const queryClient = useQueryClient();
  const { data, isPending } = useBackupVaultsList();
  const columns = useColumns();

  const reloadDatagrid = () => {
    void queryClient.invalidateQueries({ queryKey: BACKUP_VAULTS_LIST_QUERY_KEY });
  };

  return (
    <Suspense>
      <Datagrid
        topbar={
          <div className="flex justify-end" role="toolbar" aria-label={t('more_action')}>
            <OdsButton
              icon="refresh"
              color="primary"
              onClick={() => reloadDatagrid()}
              isLoading={isPending}
              variant="outline"
              data-arialabel={t(`${NAMESPACES.ACTIONS}:refresh`)}
              label=""
            />
          </div>
        }
        columns={columns}
        items={data ?? []}
        totalItems={3}
      />
      <Outlet />
    </Suspense>
  );
}
