import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  GetEdgeGatewayParams,
  useUpdateEdgeGateway,
  useVcdEdgeGatewayMocks,
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
import Loading from '@/components/loading/Loading.component';

export default function EditEdgeGatewayPage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId, edgeGatewayId } = useParams();
  const navigate = useNavigate();
  const closeDrawer = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();

  const edgeParams: GetEdgeGatewayParams = { id, vdcId, edgeGatewayId };
  const { data: edge, isLoading, refetch } = useVcdEdgeGatewayMocks({
    ...edgeParams,
    staleTime: 5000,
  });

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
    formState: { isValid },
  } = useForm<AddEdgeForm>({
    mode: 'onTouched',
    resolver: zodResolver(EDGE_FORM_SCHEMA),
    defaultValues: async () => {
      try {
        const data = await refetch();
        if (!data?.data) throw new Error('Cannot access Edge data.');
        return {
          edgeGatewayName: data.data.currentState.edgeGatewayName,
          ipBlock: data.data.currentState.ipBlock,
        };
      } catch (error) {
        return { edgeGatewayName: '', ipBlock: '' };
      }
    },
  });

  const onSubmit = (data: AddEdgeForm) =>
    updateEdgeGateway({ edgeGatewayNewName: data.edgeGatewayName });

  return (
    <Suspense fallback={<Loading />}>
      <Drawer
        isOpen
        heading={edge?.currentState.edgeGatewayName ?? ''}
        isLoading={isLoading}
        primaryButtonLabel={tActions('modify')}
        onPrimaryButtonClick={handleSubmit(onSubmit)}
        isPrimaryButtonLoading={isUpdating}
        isPrimaryButtonDisabled={isLoading || isUpdating || !isValid}
        secondaryButtonLabel={tActions('cancel')}
        onSecondaryButtonClick={closeDrawer}
        onDismiss={closeDrawer}
      >
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                options={[field.value]}
                isDisabled
                helperText={t('edge_update_ip_block_helper')}
              />
            )}
          />
        </form>
      </Drawer>
    </Suspense>
  );
}
