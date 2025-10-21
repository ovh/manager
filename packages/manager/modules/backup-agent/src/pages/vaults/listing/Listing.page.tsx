import React, {useContext} from 'react';
import { Suspense } from 'react';

import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { BaseLayout, Breadcrumb, Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_VAULTS_LIST_QUERY_KEY, useBackupVaultsList } from '@/data/hooks/vaults/getVault';

import { useColumns } from './_hooks/useColumns.hooks';
import {BackupAgentContext} from "@/BackupAgent.context";
import {BACKUP_AGENT_NAMESPACES, VAULTS_NAMESPACE_PREFIX} from "@/BackupAgent.translations";

export default function ListingPage() {
  const { appName } = useContext(BackupAgentContext);
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_LISTING]);
  const queryClient = useQueryClient();
  const { flattenData, isLoading } = useBackupVaultsList();
  const columns = useColumns();

  const reloadDatagrid = () =>
    queryClient.invalidateQueries({ queryKey: BACKUP_VAULTS_LIST_QUERY_KEY });

  return (
      <Suspense>
        <Datagrid
          topbar={
            <div className="flex justify-between" role="toolbar" aria-label={t('more_action')}>
              <Link className="block" to="/#/">
                <OdsButton label={t(`${BACKUP_AGENT_NAMESPACES.VAULT_LISTING}:order_vault`)}></OdsButton>
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
  );
}
