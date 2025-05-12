import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  mockVrackSegmentList,
  useUpdateVcdVrackNetworkVrackSegment,
  useVcdVrackNetworkSegmentOptions,
  VrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import { ErrorBoundary, Modal } from '@ovh-ux/manager-react-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
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
  const defaultQueryOptions = useVcdVrackNetworkSegmentOptions({
    id,
    vcdId: vdcId,
    vrackSegmentId,
  });

  const queryOptions = {
    ...defaultQueryOptions,
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockVrackSegmentList[0],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          } as ApiResponse<VrackSegment>);
        }, 1500);
      }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };

  const { data: vrackSegment, isLoading, isError } = useQuery(queryOptions);

  const {
    mutate: updateVrackSegment,
    isPending: isUpdatePending,
  } = useUpdateVcdVrackNetworkVrackSegment({
    id,
    vcdId: vdcId,
    vrackSegmentId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_network_delete_subnet_success'),
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
        content: t('managed_vcd_dashboard_vrack_network_delete_subnet_error', {
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
      heading={t('managed_vcd_dashboard_vrack_network_delete_subnet')}
      isLoading={isLoading}
      primaryLabel={tActions('confirm')}
      isPrimaryButtonLoading={isUpdatePending}
      isPrimaryButtonDisabled={isUpdatePending}
      onPrimaryButtonClick={handleSubmit}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
    >
      <div className="flex flex-col gap-2">
        <OdsText>
          {t('managed_vcd_dashboard_vrack_network_delete_subnet_content1')}
        </OdsText>
        <OdsMessage color="warning" isDismissible={false}>
          {t('managed_vcd_dashboard_vrack_network_delete_subnet_content2')}
        </OdsMessage>
      </div>
    </Modal>
  );
}
