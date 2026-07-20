import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  GetEdgeGatewayParams,
  useReassignEdgeIpBlock,
  useVcdEdgeGateway,
} from '@ovh-ux/manager-module-vcd-api';
import { Drawer } from '@ovh-ux/manager-react-components';
import { useMessageContext } from '@/context/Message.context';
import { useHasAvailableIpBlocks } from '@/hooks/edge/useHasAvailableIpBlocks';
import { EDGE_SCHEMAS, EditEdgeIpBlockForm } from '@/schemas/edge.schema';
import { SelectField } from '@/components/form/SelectField.component';
import { getEdgeGatewayAssignedIpBlock } from '@/utils/aggregateEdgeGateways';

export default function EditEdgeGatewayIpBlockPage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId, edgeGatewayId } = useParams();
  const navigate = useNavigate();
  const closeDrawer = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();

  const edgeParams: GetEdgeGatewayParams = { id, vdcId, edgeGatewayId };
  const { data: edge } = useVcdEdgeGateway(edgeParams);
  const {
    isLoading: isLoadingIpBlocks,
    hasAvailableIpBlocks,
    ipBlocks,
    availableIpBlocks,
  } = useHasAvailableIpBlocks();

  const isFormDataReady = !!edge && !isLoadingIpBlocks;
  const currentIpBlock = isFormDataReady
    ? getEdgeGatewayAssignedIpBlock(edge, ipBlocks)
    : undefined;
  const currentScope = currentIpBlock?.currentState.internalScope;

  const [defaultsReady, setDefaultsReady] = useState(isFormDataReady);

  const {
    mutate: reassignEdgeIpBlock,
    isPending: isUpdating,
  } = useReassignEdgeIpBlock({
    ...edgeParams,
    onSettled: closeDrawer,
    onSuccess: () => addSuccess({ content: t('edge_update_banner_success') }),
    onError: () => addError({ content: t('edge_operation_error') }),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<EditEdgeIpBlockForm>({
    mode: 'onTouched',
    resolver: zodResolver(EDGE_SCHEMAS.editEdgeIpBlock),
    defaultValues: { ipBlock: currentScope ?? '' },
  });

  useEffect(() => {
    if (isFormDataReady && !defaultsReady) {
      reset({ ipBlock: currentScope ?? '' });
      setDefaultsReady(true);
    }
  }, [isFormDataReady, defaultsReady, currentScope, reset]);

  const availableScopes = availableIpBlocks.map(
    (b) => b.currentState.internalScope,
  );

  const ipBlockOptions = currentIpBlock
    ? [currentIpBlock.currentState.internalScope, ...availableScopes]
    : availableScopes;

  const onSubmit = (data: EditEdgeIpBlockForm) => {
    const nextBlock = ipBlocks?.find(
      (b) => b.currentState.internalScope === data.ipBlock,
    );

    if (!nextBlock) {
      addError({ content: t('edge_operation_error') });
      return;
    }

    reassignEdgeIpBlock({
      previous: currentIpBlock && {
        id: currentIpBlock.id,
        name: currentIpBlock.currentState.name,
      },
      next: { id: nextBlock.id, name: nextBlock.currentState.name },
    });
  };

  return (
    <Drawer
      isOpen
      isLoading={!defaultsReady}
      heading={
        edge
          ? t('edge_edit_ip_block_of', { edgeName: edge.currentState.name })
          : t('edge_edit_ip_block')
      }
      primaryButtonLabel={tActions('modify')}
      onPrimaryButtonClick={handleSubmit(onSubmit)}
      isPrimaryButtonLoading={isUpdating}
      isPrimaryButtonDisabled={isUpdating || !isValid || !isDirty}
      secondaryButtonLabel={tActions('cancel')}
      onSecondaryButtonClick={closeDrawer}
      onDismiss={closeDrawer}
    >
      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="ipBlock"
          render={({ field }) => (
            <SelectField
              field={field}
              label={t('edge_ip_block')}
              placeholder={t('edge_ip_block_select')}
              options={ipBlockOptions}
              isDisabled={!hasAvailableIpBlocks}
              helperText={
                !hasAvailableIpBlocks
                  ? t('edge_edit_ip_block_no_available')
                  : undefined
              }
            />
          )}
        />
      </form>
    </Drawer>
  );
}
