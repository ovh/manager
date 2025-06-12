import {
  DeletionModal,
  isDiscoveryProject,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useHasActiveOrPendingSavingsPlan } from '@/hooks/useSavingsPlans';
import {
  useDeleteProjectMutation,
  useIsDefaultProject,
} from '@/hooks/useProject';
import { FEATURE_AVAILABILITY, SUPPORT_URL } from '@/constants';

export default function DeletePage() {
  const { t } = useTranslation('delete');

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '';
  const serviceId = searchParams.get('serviceId') || '';

  const { addSuccess, addError } = useNotifications();
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment?.getUser();
  const region = environment?.getRegion();

  const { data: project } = useProject(projectId);

  const { data: availability } = useFeatureAvailability([
    FEATURE_AVAILABILITY.SAVINGS_PLAN,
  ]);

  const isSavingPlansAvailable =
    availability?.[FEATURE_AVAILABILITY.SAVINGS_PLAN] || false;

  const {
    data: hasActiveOrPendingSavingPlan,
    isLoading: isSavingsPlansLoading,
  } = useHasActiveOrPendingSavingsPlan(serviceId, isSavingPlansAvailable);

  const {
    data: isDefault,
    isLoading: isDefaultProjectLoading,
  } = useIsDefaultProject(projectId);

  const handleDeleteSuccess = () => {
    addSuccess(t('pci_projects_project_edit_remove_success'));
    goBack();
  };

  const handleDeleteError = (error: ApiError) => {
    addError(
      t('pci_projects_project_edit_remove_error', {
        error: error.message,
      }),
    );
    goBack();
  };

  const {
    mutate: deleteProject,
    isPending: isDeletePending,
  } = useDeleteProjectMutation({
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
    isDefault: isDefault || false,
  });

  const handleConfirm = () => {
    if (hasActiveOrPendingSavingPlan) {
      window.open(`${SUPPORT_URL}${ovhSubsidiary}`, '_blank', 'noopener');
      goBack();
      return;
    }

    deleteProject({
      projectId,
      serviceId,
      isUs: region === 'US',
    });
  };

  /**
   * Returns the appropriate modal content message for the project deletion modal.
   * - If the project cannot be deleted due to active or pending savings plans, returns a warning message.
   * - If the project is a Discovery project, returns a specific note for Discovery projects.
   * - Otherwise, returns the standard project deletion note.
   *
   * @returns {string} The translation key for the modal content.
   */
  const modalContentMessage = useMemo(() => {
    if (hasActiveOrPendingSavingPlan) {
      return t('pci_projects_project_discovery_edit_savings_plan');
    }
    if (isDiscoveryProject(project)) {
      return t('pci_projects_project_discovery_edit_remove_please_note');
    }
    return t('pci_projects_project_edit_remove_please_note');
  }, [project, hasActiveOrPendingSavingPlan, t]);

  const isPending =
    isSavingsPlansLoading || isDefaultProjectLoading || isDeletePending;

  return (
    <DeletionModal
      title={t('pci_projects_project_edit_remove_title')}
      submitText={t(
        hasActiveOrPendingSavingPlan
          ? 'pci_projects_project_edit_remove_submit_client_service'
          : 'pci_projects_project_edit_remove_submit',
      )}
      cancelText={t('pci_projects_project_edit_remove_cancel')}
      isPending={isPending}
      isDisabled={isPending}
      onCancel={goBack}
      onClose={goBack}
      onConfirm={handleConfirm}
      data-testid="project-deletion-modal"
    >
      <OdsText preset="paragraph">{modalContentMessage}</OdsText>
    </DeletionModal>
  );
}
