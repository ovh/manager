import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteVcdVrackSegment } from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';

export default function DeleteVrackSegment() {
  const { id, vdcId, vrackSegmentId } = useParams();
  const { t } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
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
    <Modal
      isOpen
      heading={t('managed_vcd_dashboard_vrack_delete_segment')}
      primaryLabel={tActions('delete')}
      isPrimaryButtonLoading={isDeleting}
      isPrimaryButtonDisabled={isDeleting}
      onPrimaryButtonClick={deleteSegment}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <div className="flex flex-col gap-2">
        <OdsText>
          {t('managed_vcd_dashboard_vrack_delete_segment_content')}
        </OdsText>
      </div>
    </Modal>
  );
}
