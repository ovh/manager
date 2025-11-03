import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useAddEdgeGateway,
  useVcdIpBlocksMocks,
} from '@ovh-ux/manager-module-vcd-api';
import { Drawer } from '@ovh-ux/manager-react-components';
import { useMessageContext } from '@/context/Message.context';
import { AddEdgeForm, EDGE_FORM_SCHEMA } from '@/schemas/edge.schema';
import { InputField } from '@/components/form/InputField.component';
import { SelectField } from '@/components/form/SelectField.component';
import { EDGE_GATEWAY_NAME_MAX_LENGTH } from './adgeEdgeGateway.constants';

export default function AddEdgeGatewayPage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId } = useParams();
  const navigate = useNavigate();
  const closeDrawer = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();

  const { data: ipBlocks, isLoading: isLoadingIpBlocks } = useVcdIpBlocksMocks(
    id,
  );
  const availableIpBlocks = useMemo(
    () => ipBlocks?.filter((ip) => ip.resource_status.status === 'AVAILABLE'),
    [ipBlocks],
  );

  const { mutate: addEdgeGateway, isPending: isCreating } = useAddEdgeGateway({
    id,
    vdcId,
    onSettled: closeDrawer,
    onSuccess: () => addSuccess({ content: t('edge_add_banner_success') }),
    onError: () => addError({ content: t('edge_operation_error') }),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddEdgeForm>({
    mode: 'onTouched',
    resolver: zodResolver(EDGE_FORM_SCHEMA),
    defaultValues: {
      edgeGatewayName: '',
      ipBlock: '',
    },
  });

  const onSubmit = (data: AddEdgeForm) => addEdgeGateway(data);

  return (
    <Drawer
      isOpen
      heading={t('edge_add_title')}
      isLoading={isLoadingIpBlocks}
      primaryButtonLabel={t('edge_add_submit')}
      onPrimaryButtonClick={handleSubmit(onSubmit)}
      isPrimaryButtonLoading={isCreating}
      isPrimaryButtonDisabled={isLoadingIpBlocks || isCreating || !isValid}
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
              error={fieldState.error && t('edge_add_input_name_helper')}
            />
          )}
        />
        <Controller
          control={control}
          name="ipBlock"
          render={({ field, fieldState }) => (
            <SelectField
              field={field}
              label={t('edge_ip_block')}
              options={availableIpBlocks?.map((b) => b.ipBlock)}
              isDisabled={isLoadingIpBlocks || !availableIpBlocks?.length}
              isLoading={isLoadingIpBlocks}
              error={fieldState.error && t('edge_add_input_ip_block_helper')}
            />
          )}
        />
      </form>
    </Drawer>
  );
}
