import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  GetEdgeGatewayParams,
  useUpdateEdgeGateway,
  useVcdEdgeGateway,
  useVcdIpBlocks,
} from '@ovh-ux/manager-module-vcd-api';
import { Drawer } from '@ovh-ux/manager-react-components';
import { useMessageContext } from '@/context/Message.context';
import { AddEdgeForm, EDGE_FORM_SCHEMA } from '@/schemas/edge.schema';
import { InputField } from '@/components/form/InputField.component';
import { SelectField } from '@/components/form/SelectField.component';
import {
  EDGE_GATEWAY_NAME_MAX_LENGTH,
  EDGE_GATEWAY_NAME_MIN_LENGTH,
} from '../add/adgeEdgeGateway.constants';
import { isIpBlockAvailable } from '@/utils/ipBlockAvailability';
import { getEdgeGatewayAssignedIpBlock } from '@/utils/aggregateEdgeGateways';

export default function EditEdgeGatewayPage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId, edgeGatewayId } = useParams();
  const navigate = useNavigate();
  const closeDrawer = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();

  const edgeParams: GetEdgeGatewayParams = { id, vdcId, edgeGatewayId };
  const {
    data: edge,
    isLoading: isLoadingEdge,
    refetch: refetchEdges,
  } = useVcdEdgeGateway({
    ...edgeParams,
    staleTime: 5000,
  });

  const {
    data: ipBlocks,
    isLoading: isLoadingIpBlocks,
    refetch: refetchIpBlocks,
  } = useVcdIpBlocks({ id });

  const isLoading = isLoadingEdge || isLoadingIpBlocks;
  const currentIpBlock =
    edge && ipBlocks
      ? getEdgeGatewayAssignedIpBlock(edge, ipBlocks)
      : undefined;

  const {
    mutate: updateEdgeGateway,
    isPending: isUpdating,
  } = useUpdateEdgeGateway({
    ...edgeParams,
    onSettled: closeDrawer,
    onSuccess: () => addSuccess({ content: t('edge_update_banner_success') }),
    onError: () => addError({ content: t('edge_operation_error') }),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm<AddEdgeForm>({
    mode: 'onTouched',
    resolver: zodResolver(EDGE_FORM_SCHEMA),
    defaultValues: async () => {
      const edgeData = await refetchEdges();
      const blockData = await refetchIpBlocks();

      const currentEdge = edgeData?.data;
      if (!currentEdge) return { edgeGatewayName: '', ipBlock: '' };

      const currentBlock = getEdgeGatewayAssignedIpBlock(
        currentEdge,
        blockData?.data ?? [],
      );

      if (!currentBlock) {
        return {
          edgeGatewayName: currentEdge.currentState.name,
          ipBlock: '',
        };
      }

      return {
        edgeGatewayName: currentEdge.currentState.name,
        ipBlock: currentBlock.currentState.internalScope,
      };
    },
  });

  const onSubmit = (data: AddEdgeForm) => {
    const nextBlock = ipBlocks?.find(
      (b) => b.currentState.internalScope === data.ipBlock,
    );
    const nameChanged = data.edgeGatewayName !== edge?.currentState.name;
    const blockChanged = nextBlock?.id !== currentIpBlock?.id;

    updateEdgeGateway({
      name: nameChanged ? data.edgeGatewayName : undefined,
      ipBlock: blockChanged
        ? {
            previous: currentIpBlock && {
              id: currentIpBlock.id,
              name: currentIpBlock.currentState.name,
            },
            next: nextBlock && {
              id: nextBlock.id,
              name: nextBlock.currentState.name,
            },
          }
        : undefined,
    });
  };

  const availableIpBlocks =
    ipBlocks
      ?.filter(isIpBlockAvailable)
      ?.map((b) => b.currentState.internalScope) ?? [];

  const ipBlockOptions =
    currentIpBlock &&
    !availableIpBlocks.includes(currentIpBlock.currentState.internalScope)
      ? [currentIpBlock.currentState.internalScope, ...availableIpBlocks]
      : availableIpBlocks;

  return (
    <Drawer
      isOpen
      heading={edge?.currentState.name ?? ''}
      isLoading={isLoading}
      primaryButtonLabel={tActions('modify')}
      onPrimaryButtonClick={handleSubmit(onSubmit)}
      isPrimaryButtonLoading={isUpdating}
      isPrimaryButtonDisabled={isLoading || isUpdating || !isValid || !isDirty}
      secondaryButtonLabel={tActions('cancel')}
      onSecondaryButtonClick={closeDrawer}
      onDismiss={closeDrawer}
    >
      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="edgeGatewayName"
          render={({ field, fieldState }) => (
            <InputField
              field={field}
              label={t('edge_add_input_name_label')}
              validator={{ maxlength: EDGE_GATEWAY_NAME_MAX_LENGTH }}
              error={
                fieldState.error &&
                t('edge_add_input_name_helper', {
                  edgeNameMinLength: EDGE_GATEWAY_NAME_MIN_LENGTH,
                  edgeNameMaxLength: EDGE_GATEWAY_NAME_MAX_LENGTH,
                })
              }
            />
          )}
        />
        <Controller
          control={control}
          name="ipBlock"
          render={({ field }) => (
            <SelectField
              field={field}
              label={t('edge_ip_block')}
              placeholder={t('edge_ip_block_select')}
              options={ipBlockOptions}
              isDisabled={isLoadingIpBlocks}
              isLoading={isLoadingIpBlocks}
            />
          )}
        />
      </form>
    </Drawer>
  );
}
