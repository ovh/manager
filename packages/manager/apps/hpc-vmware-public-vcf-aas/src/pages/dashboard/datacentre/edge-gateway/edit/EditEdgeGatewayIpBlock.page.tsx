import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useQueryClient } from '@tanstack/react-query';
import {
  getVcdIpBlockListQueryKey,
  GetEdgeGatewayParams,
  useReassignEdgeIpBlock,
  useVcdEdgeGateway,
  VCDIpBlock,
} from '@ovh-ux/manager-module-vcd-api';
import { Drawer } from '@ovh-ux/manager-react-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useMessageContext } from '@/context/Message.context';
import { useHasAvailableIpBlocks } from '@/hooks/edge/useHasAvailableIpBlocks';
import { EDGE_SCHEMAS, EditEdgeIpBlockForm } from '@/schemas/edge.schema';
import { SelectField } from '@/components/form/SelectField.component';
import { getEdgeGatewayAssignedIpBlock } from '@/utils/aggregateEdgeGateways';
import { subRoutes } from '@/routes/routes.constant';

export default function EditEdgeGatewayIpBlockPage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId, edgeGatewayId } = useParams();
  const navigate = useNavigate();
  const closeDrawer = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();
  const queryClient = useQueryClient();

  // Optimistic update: mark the reassign IP blocks as UPDATING
  const markReassignedIpBlocksUpdating = async ({
    previous,
    next,
  }: {
    previous?: { id: string; name: string };
    next: { id: string; name: string };
  }) => {
    const queryKey = getVcdIpBlockListQueryKey(id);
    await queryClient.cancelQueries({ queryKey });
    queryClient.setQueryData<VCDIpBlock[]>(queryKey, (blocks) =>
      blocks?.map((block) =>
        block.id === next.id || block.id === previous?.id
          ? { ...block, resourceStatus: 'UPDATING' }
          : block,
      ),
    );
  };

  const edgeParams: GetEdgeGatewayParams = { id, vdcId, edgeGatewayId };
  const { data: edge } = useVcdEdgeGateway(edgeParams);
  const {
    isLoading: isLoadingIpBlocks,
    hasAvailableIpBlocks,
    ipBlocks,
    availableIpBlocks,
  } = useHasAvailableIpBlocks({ refetchOnMount: 'always' });

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
    onSettled: (_data, error, variables) => {
      if (!error && variables) markReassignedIpBlocksUpdating(variables);
      closeDrawer();
    },
    onSuccess: () =>
      addSuccess({
        content: t('edge_update_banner_success', {
          edgeName: edge?.currentState.name,
        }),
        includedSubRoutes: [subRoutes.edgeGateway],
      }),
    onError: () =>
      addError({
        content: t('edge_operation_error'),
        includedSubRoutes: [subRoutes.edgeGateway],
      }),
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
      addError({
        content: t('edge_operation_error'),
        includedSubRoutes: [subRoutes.edgeGateway],
      });
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
        {!isLoadingIpBlocks && !hasAvailableIpBlocks && (
          <OdsMessage color="warning" isDismissible={false}>
            {t('edge_edit_ip_block_no_available')}
          </OdsMessage>
        )}
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
            />
          )}
        />
      </form>
    </Drawer>
  );
}
