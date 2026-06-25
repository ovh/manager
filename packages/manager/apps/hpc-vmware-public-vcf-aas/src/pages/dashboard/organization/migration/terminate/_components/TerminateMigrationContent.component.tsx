import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useMessageContext } from '@/context/Message.context';
import { useVcdaMigration } from '@/data/hooks/vcda/useVcdaMigration.hook';
import { getVcdaStatusQueryKey } from '@/data/hooks/vcda/useVcdaStatus.hook';
import { getVcdaMigrationQueryKey } from '@/data/hooks/vcda/vcdaQueryKey';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';

/**
 * VCDA service termination — route-based critical confirmation (mirrors
 * `pages/terminate/TerminateOrganization.page`).
 *
 * `migration.id` is the Agora resourceName: `useDeleteService` resolves it to the
 * serviceId (GET /services?resourceName=) before terminating.
 */
export default function TerminateMigrationContent() {
  const { id } = useParams();
  const { t } = useTranslation('vcda');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccess } = useMessageContext();
  const { data: migration, isLoading: isMigrationLoading } = useVcdaMigration(
    id ?? '',
  );

  const closeModal = () => navigate('..');

  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess: () => {
      // Both caches must refresh → tile goes to DELETING, the tab unmounts.
      void queryClient.invalidateQueries({
        queryKey: getVcdaStatusQueryKey(id ?? ''),
      });
      void queryClient.invalidateQueries({
        queryKey: getVcdaMigrationQueryKey(id ?? ''),
      });
      addSuccess({
        content: t('serviceTermination.success'),
        isDismissible: true,
        includedSubRoutes: [id ?? ''],
      });
      closeModal();
    },
  });

  const onConfirmDelete = () => {
    if (!migration?.id) return;
    terminateService({ resourceName: migration.id });
  };

  // Termination is only valid in READY; a deep-link in any other state
  // redirects to the Dashboard (the tile CTA is the only gated entry point).
  if (migration && migration.resourceStatus !== 'READY') {
    return <Navigate to={urls.dashboard.replace(':id', id ?? '')} replace />;
  }

  return (
    <DeleteModal
      isOpen
      serviceTypeName="VCDA"
      closeModal={closeModal}
      isLoading={isPending || isMigrationLoading}
      error={isError ? error?.message : null}
      onConfirmDelete={onConfirmDelete}
    >
      <OdsText
        preset="paragraph"
        data-testid={TEST_IDS.migrationTerminateDescription}
      >
        {t('serviceTermination.modalDescription')}
      </OdsText>
    </DeleteModal>
  );
}
