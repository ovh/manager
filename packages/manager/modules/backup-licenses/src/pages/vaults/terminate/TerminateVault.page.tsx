import React from 'react';

import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { DeleteModal, useNotifications } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { queryKeys } from '@/data/queries/queryKeys';
import { vaultsQueries } from '@/data/queries/vaults.queries';
import {
  selectBackupLicensesVaults,
  selectCanTerminateVault,
} from '@/data/selectors/vaults.selectors';
import { useReturnFocus } from '@/hooks/useReturnFocus/useReturnFocus';
import { routeUrls } from '@/routes/routes.constants';

import { getVaultActionsTriggerId } from '../vaults.constants';

export default function TerminateVaultPage() {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.VAULTS]);
  const { vaultId } = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccess } = useNotifications();

  const returnFocusToTrigger = useReturnFocus(getVaultActionsTriggerId(vaultId ?? ''));

  const closeModal = () => {
    navigate(routeUrls.vaults);
    returnFocusToTrigger();
  };

  // Same projection as the tab's list, so a vault of another product line stays unreachable by URL.
  const { data: vaults, isSuccess } = useQuery({
    ...vaultsQueries.withClient(queryClient).list(),
    select: selectBackupLicensesVaults,
  });
  const vault = vaults?.find(({ id }) => id === vaultId);

  const { terminateService, isPending, isError, error } = useDeleteService({
    onSuccess: () => {
      addSuccess(t('terminate.success'));
      void queryClient.invalidateQueries({ queryKey: queryKeys.vaults.all() });
      closeModal();
    },
  });

  // The confirmation names the vault and its region, so there is nothing to show before the list
  // resolves — an empty message is worse than no modal.
  if (!isSuccess) {
    return null;
  }

  // The modal is a deep-linkable route, so the action menu being disabled is not a guard: a URL
  // typed by hand would otherwise terminate the included vault.
  if (!vault || !selectCanTerminateVault(vault)) {
    return <Navigate to={routeUrls.vaults} replace />;
  }

  return (
    <DeleteModal
      isOpen
      serviceTypeName={t('service_type')}
      closeModal={closeModal}
      isLoading={isPending}
      error={isError ? error?.response?.data?.message || t('terminate.error') : undefined}
      onConfirmDelete={() => terminateService({ resourceName: vault.currentState.resourceName })}
    >
      <OdsText>
        {t('terminate.message', {
          name: vault.currentState.name,
          region: vault.currentState.region,
        })}
      </OdsText>
    </DeleteModal>
  );
}
