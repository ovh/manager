import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  GetEdgeGatewayParams,
  VCDEdgeGateway,
  getVcdEdgeGatewayListQueryKey,
  useDeleteEdgeGateway,
  useVcdEdgeGateway,
} from '@ovh-ux/manager-module-vcd-api';
import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';

export default function DeleteEdgeGatewayPage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId, edgeGatewayId } = useParams();
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();
  const queryClient = useQueryClient();

  const edgeParams: GetEdgeGatewayParams = { id, vdcId, edgeGatewayId };
  const { data: edge, isLoading } = useVcdEdgeGateway(edgeParams);
  const edgeName = edge?.currentState.name;

  // Optimistic update: mark the edge as DELETING in the query cache
  const markEdgeAsDeleting = async () => {
    const queryKey = getVcdEdgeGatewayListQueryKey(id, vdcId);
    await queryClient.cancelQueries({ queryKey });
    queryClient.setQueryData<VCDEdgeGateway[]>(queryKey, (edges) =>
      edges?.map((currentEdge) =>
        currentEdge.id === edgeGatewayId
          ? { ...currentEdge, resourceStatus: 'DELETING' }
          : currentEdge,
      ),
    );
  };

  const { mutate: deleteEdge, isPending: isDeleting } = useDeleteEdgeGateway({
    ...edgeParams,
    onSettled: closeModal,
    onSuccess: async () => {
      await markEdgeAsDeleting();
      addSuccess({
        content: t('edge_delete_banner_success', { edgeName }),
        includedSubRoutes: [subRoutes.edgeGateway],
      });
    },
    onError: () => {
      addError({
        content: t('edge_operation_error'),
        includedSubRoutes: [subRoutes.edgeGateway],
      });
    },
  });

  return (
    <Modal
      isOpen
      heading={t('edge_delete_title')}
      isLoading={isLoading}
      primaryLabel={tActions('delete')}
      isPrimaryButtonLoading={isLoading || isDeleting}
      isPrimaryButtonDisabled={isLoading || isDeleting}
      onPrimaryButtonClick={deleteEdge}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <div className="flex flex-col gap-2">
        <OdsText>{t('edge_delete_description', { edgeName })}</OdsText>
        <OdsMessage color="warning" isDismissible={false}>
          {t('edge_delete_warning')}
        </OdsMessage>
      </div>
    </Modal>
  );
}
