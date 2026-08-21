import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useQueryClient } from '@tanstack/react-query';
import {
  getVcdEdgeGatewayListQueryKey,
  GetEdgeGatewayParams,
  useUpdateEdgeGateway,
  useVcdEdgeGateway,
  VCDEdgeGateway,
} from '@ovh-ux/manager-module-vcd-api';
import { Drawer } from '@ovh-ux/manager-react-components';
import { useMessageContext } from '@/context/Message.context';
import { EDGE_SCHEMAS, EditEdgeNameForm } from '@/schemas/edge.schema';
import { InputField } from '@/components/form/InputField.component';
import { subRoutes } from '@/routes/routes.constant';
import {
  EDGE_GATEWAY_NAME_MAX_LENGTH,
  EDGE_GATEWAY_NAME_MIN_LENGTH,
} from '../add/adgeEdgeGateway.constants';

export default function EditEdgeGatewayNamePage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId, edgeGatewayId } = useParams();
  const navigate = useNavigate();
  const closeDrawer = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();
  const queryClient = useQueryClient();

  // Optimistic update: mark the edge as UPDATING
  const markEdgeAsUpdating = async () => {
    const queryKey = getVcdEdgeGatewayListQueryKey(id, vdcId);
    await queryClient.cancelQueries({ queryKey });
    queryClient.setQueryData<VCDEdgeGateway[]>(queryKey, (edges) =>
      edges?.map((currentEdge) =>
        currentEdge.id === edgeGatewayId
          ? { ...currentEdge, resourceStatus: 'UPDATING' }
          : currentEdge,
      ),
    );
  };

  const edgeParams: GetEdgeGatewayParams = { id, vdcId, edgeGatewayId };
  const { data: edge, isFetchedAfterMount } = useVcdEdgeGateway({
    ...edgeParams,
    refetchOnMount: 'always',
  });
  const currentName = edge?.currentState.name;

  const [defaultsReady, setDefaultsReady] = useState(false);

  const {
    mutate: updateEdgeGateway,
    isPending: isUpdating,
  } = useUpdateEdgeGateway({
    ...edgeParams,
    onSettled: (_data, error) => {
      if (!error) markEdgeAsUpdating();
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
  } = useForm<EditEdgeNameForm>({
    mode: 'onTouched',
    resolver: zodResolver(EDGE_SCHEMAS.editEdgeName),
    defaultValues: { name: currentName ?? '' },
  });

  // Seed the input only once the mount refetch has settled, so the default value
  // is the current name (not a stale cached one being refreshed in the background).
  useEffect(() => {
    if (isFetchedAfterMount && currentName !== undefined && !defaultsReady) {
      reset({ name: currentName });
      setDefaultsReady(true);
    }
  }, [isFetchedAfterMount, currentName, defaultsReady, reset]);

  const onSubmit = (data: EditEdgeNameForm) => {
    updateEdgeGateway({ name: data.name });
  };

  return (
    <Drawer
      isOpen
      isLoading={!defaultsReady}
      heading={
        edge
          ? t('edge_edit_name_of', { edgeName: edge.currentState.name })
          : t('edge_edit_name')
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
          name="name"
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
      </form>
    </Drawer>
  );
}
