import { useContext, useMemo } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { AxiosError } from 'axios';
import { Translation, useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { Modal, useFeatureAvailability, useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { FEATURE_AVAILABILITY, SUPPORT_URL } from '@/constants';
import { useIsDefaultProject, useRemoveProjectMutation } from '@/data/hooks/useProjects';
import { useHasActiveOrPendingSavingsPlan } from '@/data/hooks/useSavingsPlans';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { PROJECTS_TRACKING } from '@/tracking.constant';
import { TProject } from '@/types/pci-common.types';

type ApiError = AxiosError<{ message: string }>;

export default function RemovePage() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('remove');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const goBack = () => navigate('..');

  const projectId = useProjectIdFromParams();
  const serviceId = searchParams.get('serviceId') || '';

  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment?.getUser();
  const region = environment?.getRegion();

  const { data: project } = (
    useProject as unknown as (id: string) => {
      data: TProject | undefined;
    }
  )(projectId);

  const { data: availability } = useFeatureAvailability([FEATURE_AVAILABILITY.SAVINGS_PLAN]);

  const isSavingPlansAvailable = availability?.[FEATURE_AVAILABILITY.SAVINGS_PLAN] || false;

  const { data: hasActiveOrPendingSavingPlan, isLoading: isSavingsPlansLoading } =
    useHasActiveOrPendingSavingsPlan(serviceId, isSavingPlansAvailable);

  const { data: isDefault, isLoading: isDefaultProjectLoading } = useIsDefaultProject(projectId);

  const handleRemoveSuccess = () => {
    trackPage({
      pageType: PageType.bannerInfo,
      pageName: PROJECTS_TRACKING.DELETE.REQUEST_SUCCESS,
    });

    clearNotifications();
    addSuccess(
      <Translation ns="remove">
        {(_t) => _t('pci_projects_project_edit_remove_success')}
      </Translation>,
    );

    goBack();
  };

  const handleRemoveError = (error: ApiError) => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: PROJECTS_TRACKING.DELETE.REQUEST_FAIL,
    });

    clearNotifications();
    addError(
      <Translation ns="remove">
        {(_t) =>
          _t('pci_projects_project_edit_remove_error', {
            error: error.message,
          })
        }
      </Translation>,
    );

    goBack();
  };

  const { mutate: removeProject, isPending: isRemovePending } = useRemoveProjectMutation({
    onSuccess: handleRemoveSuccess,
    onError: handleRemoveError,
    isDefault: isDefault || false,
  });

  const handleConfirm = () => {
    if (hasActiveOrPendingSavingPlan) {
      window.open(`${SUPPORT_URL}${ovhSubsidiary}`, '_blank', 'noopener');
      goBack();
      return;
    }

    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.DELETE.CTA_CONFIRM,
    });

    removeProject({
      projectId,
      serviceId,
      isUs: String(region) === 'US',
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
    if ((isDiscoveryProject as (p: TProject | undefined) => boolean)(project)) {
      return t('pci_projects_project_discovery_edit_remove_please_note');
    }
    return t('pci_projects_project_edit_remove_please_note');
  }, [project, hasActiveOrPendingSavingPlan, t]);

  const isPending = isSavingsPlansLoading || isDefaultProjectLoading || isRemovePending;

  return (
    <Modal
      type={ODS_MODAL_COLOR.warning}
      primaryLabel={t(
        hasActiveOrPendingSavingPlan
          ? 'pci_projects_project_edit_remove_submit_client_service'
          : 'pci_projects_project_edit_remove_submit',
      )}
      onPrimaryButtonClick={handleConfirm}
      secondaryLabel={t('pci_projects_project_edit_remove_cancel')}
      onSecondaryButtonClick={handleCancel}
      isLoading={isPending}
      onDismiss={goBack}
      isOpen={true}
    >
      <OdsText preset="heading-3" className="mb-6">
        {t('pci_projects_project_edit_remove_title')}
      </OdsText>
      <OdsText preset="paragraph">{modalContentMessage}</OdsText>
    </Modal>
  );
}
