import React from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Datagrid } from '@ovh-ux/manager-react-components';

import BillingError from '@/components/billing/BillingError/BillingError.component';
import BillingPeriodNotice from '@/components/billing/BillingPeriodNotice/BillingPeriodNotice.component';
import BillingTopbar from '@/components/billing/BillingTopbar/BillingTopbar.component';
import { billingQueries } from '@/data/queries/billing.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { useBillingColumns } from '@/hooks/useBillingColumns/useBillingColumns';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

/**
 * Onglet « Facturation » (BKP-1225) : une ligne = un vault (consommation stockage + prix
 * licence). Rendu dans l'Outlet de `ServiceLayout` — pas de `BaseLayout` ici (§6 de la spec).
 *
 * La mention de période reste affichée même en cas d'erreur globale (§6) : erreur et
 * `Datagrid` sont les deux seuls états mutuellement exclusifs (§8).
 */
export default function BillingPage() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.BILLING);
  const queryClient = useQueryClient();
  const columns = useBillingColumns();

  const { data, isPending, isError, refetch } = useQuery(
    billingQueries.withClient(queryClient).consumptionRows(),
  );

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.billing.all() });
  };

  return (
    <section className="flex flex-col gap-4">
      <BillingPeriodNotice
        beginDate={data?.period.beginDate ?? null}
        endDate={data?.period.endDate ?? null}
      />
      {isError ? (
        <BillingError onRetry={() => void refetch()} />
      ) : (
        <Datagrid
          topbar={
            <div className="flex justify-end">
              <BillingTopbar isLoading={isPending} onRefresh={handleRefresh} />
            </div>
          }
          columns={columns}
          items={data?.rows ?? []}
          totalItems={data?.rows.length ?? 0}
          isLoading={isPending}
          noResultLabel={t('empty_state')}
        />
      )}
    </section>
  );
}
