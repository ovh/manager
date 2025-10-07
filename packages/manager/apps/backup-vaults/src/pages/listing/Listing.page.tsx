import React from 'react';
import { Suspense } from 'react';

import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { BaseLayout, Breadcrumb, Datagrid } from '@ovh-ux/manager-react-components';

import { appName } from '@/App.constants';
import { BACKUP_VAULTS_LIST_QUERY_KEY, useBackupVaultsList } from '@/data/hooks/vault/getVault';

import { useColumns } from './_hooks/useColumns.hooks';

export default function ListingPage() {
  const { t } = useTranslation(['listing']);
  const queryClient = useQueryClient();
  const { flattenData, isLoading } = useBackupVaultsList();
  const columns = useColumns();

  const reloadDatagrid = () =>
    queryClient.invalidateQueries({ queryKey: BACKUP_VAULTS_LIST_QUERY_KEY });

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={appName} />}
      header={{ title: t('listing:title') }}
    >
      <Suspense>
        <Datagrid
          topbar={
            <div className="flex justify-between" role="toolbar" aria-label={t('more_action')}>
              <Link className="block" to="/#/">
                <OdsButton label={t('listing:order_vault')}></OdsButton>
              </Link>
              <OdsButton
                icon="refresh"
                color="primary"
                onClick={void reloadDatagrid}
                isLoading={isLoading}
                data-arialabel="Refresh" // TODO add translation
                label=""
              />
            </div>
          }
          columns={columns}
          items={flattenData ?? []}
          totalItems={3}
        />
      </Suspense>
    </BaseLayout>
  );
}
