import React, { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { Datagrid } from '@ovh-ux/manager-react-components';

import LinkedServersError from '@/components/linked-servers/LinkedServersError/LinkedServersError.component';
import LinkedServersTopbar from '@/components/linked-servers/LinkedServersTopbar/LinkedServersTopbar.component';
import { backupServersQueries } from '@/data/queries/backupServers.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { useBackupServersPolling } from '@/hooks/useBackupServersPolling/useBackupServersPolling';
import { useLinkedServersColumns } from '@/hooks/useLinkedServersColumns/useLinkedServersColumns';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

/**
 * Onglet « Linked servers » (BKP-1216) : une ligne = un serveur VBR enregistré + sa licence.
 *
 * Trois états mutuellement exclusifs : erreur, chargement, liste. La liste vide n'en est pas
 * un : le `Datagrid` rend lui-même `noResultLabel` quand la liste est vide, et sa topbar —
 * donc le CTA d'ajout attendu par l'empty state — est rendue quelle que soit sa taille.
 */
export default function LinkedServersPage() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);
  const queryClient = useQueryClient();
  const columns = useLinkedServersColumns();

  const listOptions = backupServersQueries.withClient(queryClient).list();

  // Le polling se décide sur la donnée déjà en cache : `useQuery` a besoin de
  // `refetchInterval` avant de renvoyer `data`. Le composant étant abonné à cette query,
  // chaque réponse déclenche un rendu, donc la valeur lue ici est toujours la plus récente.
  const { refetchInterval, hasTimedOut, resetPolling } = useBackupServersPolling(
    queryClient.getQueryData(listOptions.queryKey),
  );

  const { data, isPending, isError, refetch } = useQuery({ ...listOptions, refetchInterval });

  const handleRefresh = () => {
    resetPolling();
    void queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
  };

  if (isError) {
    return <LinkedServersError onRetry={() => void refetch()} />;
  }

  return (
    <section className="flex flex-col gap-4">
      {hasTimedOut && (
        <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
          <OdsText>{t('polling.timeout')}</OdsText>
        </OdsMessage>
      )}
      <Datagrid
        topbar={<LinkedServersTopbar isLoading={isPending} onRefresh={handleRefresh} />}
        columns={columns}
        items={data ?? []}
        totalItems={data?.length ?? 0}
        isLoading={isPending}
        noResultLabel={t('empty_state')}
      />
      {/* Modales de ligne (suppression, puis édition au ticket 2.3). Le `Suspense` est local
          pour que le chargement du chunk de la modale ne masque pas la liste. */}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </section>
  );
}
