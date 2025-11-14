import React from 'react';
import { Suspense } from 'react';

import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { useColumns } from './_hooks/useBillingListingColumns.hooks';
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {BACKUP_AGENT_NAMESPACES } from "@/BackupAgent.translations";

export default function ListingPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_LISTING, NAMESPACES.ACTIONS]);
  const queryClient = useQueryClient();
  // const { flattenData, isLoading } = useBackupVaultsList();
  const columns = useColumns();

  const reloadDatagrid = () =>
    queryClient.invalidateQueries({ queryKey: ['TODO'] });

  return (
      <Suspense>
        <Datagrid
          topbar={
            <div className="flex justify-end" role="toolbar" aria-label={t('more_action')}>
              <OdsButton
                icon="refresh"
                color="primary"
                onClick={void reloadDatagrid}
                isLoading={false}
                data-arialabel={t(`${NAMESPACES.ACTIONS}:refresh`)}
                label=""
              />
            </div>
          }
          columns={columns}
          items={[]}
          totalItems={3}
        />
      </Suspense>
  );
}
