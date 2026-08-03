import React from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { routeUrls } from '@/routes/routes.constants';

import { VaultsEmptyState } from './_components/VaultsEmptyState.component';
import { VaultsErrorState } from './_components/VaultsErrorState.component';
import { useVaultColumns } from './_hooks/useVaultColumns.hook';
import { useVaultsList } from './_hooks/useVaultsList.hook';

export const VAULTS_TEST_IDS = {
  page: 'vaults-page',
} as const;

export default function VaultsPage() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.VAULTS);
  const navigate = useNavigate();
  const columns = useVaultColumns();
  const { vaults, isPending, isError, refetch } = useVaultsList();

  const renderVaults = () => {
    if (isError) {
      return <VaultsErrorState onRetry={() => void refetch()} />;
    }

    if (!isPending && vaults.length === 0) {
      return <VaultsEmptyState />;
    }

    return (
      <Datagrid
        columns={columns}
        items={vaults}
        totalItems={vaults.length}
        isLoading={isPending}
        contentAlignLeft
      />
    );
  };

  return (
    <section className="flex flex-col gap-6" data-testid={VAULTS_TEST_IDS.page}>
      <div className="flex">
        <OdsButton
          data-testid="order-vault"
          size={ODS_BUTTON_SIZE.sm}
          label={t('cta.order')}
          onClick={() => navigate(routeUrls.orderVault)}
        />
      </div>
      <div aria-live="polite" aria-busy={isPending}>
        {renderVaults()}
      </div>
      <Outlet />
    </section>
  );
}
