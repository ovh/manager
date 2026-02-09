import React, { Suspense } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { Datagrid, Links } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ReloadButton } from '@/components/ReloadButton/ReloadButton.component';
import { queryKeys } from '@/data/queries/queryKeys';
import { vaultsQueries } from '@/data/queries/vaults.queries';
import { useGuideUtils } from '@/hooks/useGuideUtils';

import { useColumns } from './_hooks/useBillingListingColumns.hooks';

export default function ListingPage() {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.VAULT_LISTING);
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(vaultsQueries.withClient(queryClient).list());
  const columns = useColumns();
  const guide = useGuideUtils();

  return (
    <section className="flex flex-col gap-8">
      <OdsText>
        <Trans
          ns={BACKUP_AGENT_NAMESPACES.COMMON}
          i18nKey="billings_tab_description"
          components={{
            Link: (
              <Links
                className="px-2"
                rel="noopener noreferrer"
                target="_blank"
                href={guide?.cost}
              />
            ),
          }}
        />
      </OdsText>
      <Suspense>
        <Datagrid
          topbar={
            <div className="flex justify-end" role="toolbar" aria-label={t('more_action')}>
              <ReloadButton
                isLoading={isPending}
                queryKeys={[queryKeys.vaults.all, queryKeys.consumption.all]}
              />
            </div>
          }
          columns={columns}
          items={data ?? []}
          totalItems={data?.length ?? 0}
        />
      </Suspense>
    </section>
  );
}
