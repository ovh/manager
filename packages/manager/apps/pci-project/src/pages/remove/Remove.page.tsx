import {
  DeletionModal,
  isDiscoveryProject,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  ShellContext,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useHasActiveOrPendingSavingsPlan } from '@/data/hooks/useSavingsPlans';
import {
  useRemoveProjectMutation,
  useIsDefaultProject,
} from '@/data/hooks/useProjects';
import { FEATURE_AVAILABILITY, SUPPORT_URL } from '@/constants';
import { PROJECTS_TRACKING } from '@/tracking.constant';

export default function RemovePage() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('remove');

  const { projectId: projectIdParam } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const [searchParams] = useSearchParams();
  const projectId = projectIdParam || searchParams.get('projectId') || '';
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

  const handleRemoveSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: PROJECTS_TRACKING.DELETE.REQUEST_SUCCESS,
    });
    addSuccess(t('pci_projects_project_edit_remove_success'));
    goBack();
  };

  const handleRemoveError = (error: ApiError) => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: PROJECTS_TRACKING.DELETE.REQUEST_FAIL,
    });
    addError(
      t('pci_projects_project_edit_remove_error', {
        error: error.message,
      }),
    );
    goBack();
  };

  const {
    mutate: removeProject,
    isPending: isRemovePending,
  } = useRemoveProjectMutation({
    onSuccess: handleRemoveSuccess,
    onError: handleRemoveError,
    isDefault: isDefault || false,
  });

  const handleConfirm = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.DELETE.CTA_CONFIRM,
    });
    if (hasActiveOrPendingSavingPlan) {
      window.open(`${SUPPORT_URL}${ovhSubsidiary}`, '_blank', 'noopener');
      goBack();
      return;
    }

    removeProject({
      projectId,
      serviceId,
      isUs: region === 'US',
    });
  };

  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.DELETE.CTA_CANCEL,
    });
    goBack();
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
    isSavingsPlansLoading || isDefaultProjectLoading || isRemovePending;

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
      onCancel={handleCancel}
      onClose={goBack}
      onConfirm={handleConfirm}
    >
      <OdsText preset="paragraph">{modalContentMessage}</OdsText>
    </DeletionModal>
  );
}
