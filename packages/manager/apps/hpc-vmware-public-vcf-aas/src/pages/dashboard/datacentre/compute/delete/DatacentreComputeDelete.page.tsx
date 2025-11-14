import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteVcdDatacentreCompute } from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';

export default function ComputeDeletePage() {
  const { id, vdcId, computeId } = useParams();
  const { t } = useTranslation(['datacentres', 'datacentres/compute']);
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();

  const {
    mutate: deleteCompute,
    isPending: isDeleting,
  } = useDeleteVcdDatacentreCompute({
    id,
    vdcId,
    computeId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_vdc_delete_resource_success'),
        includedSubRoutes: [subRoutes.datacentreCompute],
        excludedSubRoutes: [subRoutes.datacentreComputeOrder],
      });
    },
    onError: (error) => {
      addError({
        content: t('managed_vcd_vdc_delete_resource_error', {
          error: error.message,
        }),
        includedSubRoutes: [subRoutes.datacentreCompute],
        excludedSubRoutes: [subRoutes.datacentreComputeOrder],
      });
    },
    onSettled: closeModal,
  });

  return (
    <Modal
      isOpen
      heading={t('managed_vcd_vdc_delete_resource')}
      primaryLabel={tActions('delete')}
      isPrimaryButtonLoading={isDeleting}
      isPrimaryButtonDisabled={isDeleting}
      onPrimaryButtonClick={deleteCompute}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <OdsText>
        {t(
          'datacentres/compute:managed_vcd_vdc_compute_delete_modal_description',
          { computeId },
        )}
      </OdsText>
    </Modal>
  );
}
