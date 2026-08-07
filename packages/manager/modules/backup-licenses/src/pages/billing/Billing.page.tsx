import React from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';

import BillingError from '@/components/billing/BillingError/BillingError.component';
import BillingPeriodNotice from '@/components/billing/BillingPeriodNotice/BillingPeriodNotice.component';
import BillingTopbar from '@/components/billing/BillingTopbar/BillingTopbar.component';
import { billingQueries } from '@/data/queries/billing.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { useLicenseBillingColumns } from '@/hooks/useLicenseBillingColumns/useLicenseBillingColumns';
import { useVaultBillingColumns } from '@/hooks/useVaultBillingColumns/useVaultBillingColumns';
import { BACKUP_LICENSES_NAMESPACES, LABELS } from '@/module.constants';

/**
 * Onglet « Facturation » (BKP-1225) : deux tableaux indépendants, un par ressource
 * (licences, vaults), plutôt qu'une ligne par vault avec une colonne prix licence
 * accolée — les deux n'ont pas de cardinalité fixe entre elles (X licences pour 1 vault,
 * ou l'inverse), un couplage visuel suggérerait à tort une corrélation qui n'existe pas.
 * Rendu dans l'Outlet de `ServiceLayout` — pas de `BaseLayout` ici (§6 de la spec).
 *
 * Un seul bandeau période/actualisation pour les deux tableaux : ils viennent de la même
 * requête, deux boutons « actualiser » distincts déclencheraient le même refetch.
 */
export default function BillingPage() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.BILLING);
  const queryClient = useQueryClient();
  const vaultColumns = useVaultBillingColumns();
  const licenseColumns = useLicenseBillingColumns();

  const { data, isPending, isError, refetch } = useQuery(
    billingQueries.withClient(queryClient).consumptionRows(),
  );

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.billing.all() });
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <BillingPeriodNotice
          beginDate={data?.period.beginDate ?? null}
          endDate={data?.period.endDate ?? null}
        />
        <BillingTopbar isLoading={isPending} onRefresh={handleRefresh} />
      </div>
      {isError ? (
        <BillingError onRetry={() => void refetch()} />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <OdsText preset={ODS_TEXT_PRESET.heading4}>{t('licenses.title')}</OdsText>
            <Datagrid
              columns={licenseColumns}
              items={data?.licenseRows ?? []}
              totalItems={data?.licenseRows.length ?? 0}
              isLoading={isPending}
              noResultLabel={t('licenses.empty_state')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <OdsText preset={ODS_TEXT_PRESET.heading4}>{LABELS.VAULTS}</OdsText>
            <Datagrid
              columns={vaultColumns}
              items={data?.vaultRows ?? []}
              totalItems={data?.vaultRows.length ?? 0}
              isLoading={isPending}
              noResultLabel={t('vaults.empty_state')}
            />
          </div>
        </>
      )}
    </section>
  );
}
