import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteVcdDatacentreStorage } from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';

export default function StorageDeletePage() {
  const { id, vdcId, storageId } = useParams();
  const { t } = useTranslation(['datacentres', 'datacentres/storage']);
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();

  const {
    mutate: deleteStorage,
    isPending: isDeleting,
  } = useDeleteVcdDatacentreStorage({
    id,
    vdcId,
    storageId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_vdc_delete_resource_success'),
        includedSubRoutes: [subRoutes.datacentreStorage],
        excludedSubRoutes: [subRoutes.datacentreStorageOrder],
      });
    },
    onError: (error) => {
      addError({
        content: t('managed_vcd_vdc_delete_resource_error', {
          error: error.message,
        }),
        includedSubRoutes: [subRoutes.datacentreStorage],
        excludedSubRoutes: [subRoutes.datacentreStorageOrder],
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
      onPrimaryButtonClick={deleteStorage}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <OdsText>
        {t(
          'datacentres/storage:managed_vcd_vdc_storage_delete_modal_description',
          { storageId },
        )}
      </OdsText>
    </Modal>
  );
}
