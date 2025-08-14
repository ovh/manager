import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  useUpdateVcdVrackSegment,
  useVcdVrackSegmentOptions,
} from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ErrorBoundary, Modal } from '@ovh-ux/manager-react-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';
import { decodeVrackNetwork } from '@/utils/encodeVrackNetwork';

export default function DeleteVrackNetwork() {
  const { id, vdcId, vrackSegmentId, vrackNetworkId } = useParams();
  const { t } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();
  const defaultQueryOptions = useVcdVrackSegmentOptions({
    id,
    vdcId,
    vrackSegmentId,
  });

  const queryOptions = {
    ...defaultQueryOptions,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };

  const { data: vrackSegment, isLoading, isError } = useQuery(queryOptions);

  const {
    mutate: updateVrackSegment,
    isPending: isUpdatePending,
  } = useUpdateVcdVrackSegment({
    id,
    vdcId,
    vrackSegmentId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_delete_network_success'),
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
        content: t('managed_vcd_dashboard_vrack_delete_network_error', {
          errorApi: error.message,
        }),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
  });

  if (isError) {
    return (
      <Modal isOpen onDismiss={closeModal}>
        <ErrorBoundary redirectionApp="vcd" />
      </Modal>
    );
  }

  const handleSubmit = () => {
    const filtered = vrackSegment.targetSpec.networks.filter(
      (network) => network !== decodeVrackNetwork(vrackNetworkId),
    );
    updateVrackSegment({ ...vrackSegment.targetSpec, networks: filtered });
  };

  return (
    <Modal
      isOpen
      heading={t('managed_vcd_dashboard_vrack_delete_network')}
      isLoading={isLoading}
      primaryLabel={tActions('delete')}
      isPrimaryButtonLoading={isUpdatePending}
      isPrimaryButtonDisabled={isUpdatePending}
      onPrimaryButtonClick={handleSubmit}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <div className="flex flex-col gap-2">
        <OdsText>
          {t('managed_vcd_dashboard_vrack_delete_network_content1')}
        </OdsText>
        <OdsMessage color="warning" isDismissible={false}>
          {t('managed_vcd_dashboard_vrack_delete_network_content2')}
        </OdsMessage>
      </div>
    </Modal>
  );
}
