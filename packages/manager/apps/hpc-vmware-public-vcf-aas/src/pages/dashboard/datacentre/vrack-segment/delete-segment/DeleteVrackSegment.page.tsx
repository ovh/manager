import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteVcdVrackSegment } from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';
import { TRACKING } from '@/tracking.constants';
import { DeleteModal } from '@/components/deleteModal/DeleteModal.component';

export default function DeleteVrackSegment() {
  const { id, vdcId, vrackSegmentId } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const cancelModal = () => {
    trackClick(TRACKING.vrackDeleteSegment.cancel);
    closeModal();
  };
  const { addSuccess, addError } = useMessageContext();

  const getDeleteErrorMessage = (message?: string) =>
    !message
      ? t('managed_vcd_dashboard_vrack_delete_segment_error_default')
      : t('managed_vcd_dashboard_vrack_delete_segment_error', {
          errorApi: message,
        });

  const {
    mutate: deleteSegment,
    isPending: isDeleting,
  } = useDeleteVcdVrackSegment({
    id,
    vdcId,
    vrackSegmentId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_vcfaas-segment_success',
      });
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_delete_segment_success'),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
    onError: (error) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: `delete_vcfaas-segment_error::${error.message
          .replaceAll(' ', '-')
          .toLowerCase()}`,
      });
      addError({
        content: getDeleteErrorMessage(error.message),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
  });

  return (
    <DeleteModal
      isOpen
      heading={t('managed_vcd_dashboard_vrack_delete_segment')}
      primaryLabel={tActions('delete')}
      isPrimaryButtonLoading={isDeleting}
      isPrimaryButtonDisabled={isDeleting}
      onPrimaryButtonClick={() => {
        deleteSegment();
        trackClick(TRACKING.vrackDeleteSegment.confirm);
      }}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={cancelModal}
      onDismiss={cancelModal}
      confirmationKeyword={tActions('delete').toUpperCase()}
    >
      <div className="flex flex-col gap-2">
        <OdsText>
          {t('managed_vcd_dashboard_vrack_delete_segment_content')}
        </OdsText>
      </div>
    </DeleteModal>
  );
}
