import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useAddEdgeGateway } from '@ovh-ux/manager-module-vcd-api';
import { Drawer } from '@ovh-ux/manager-react-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useMessageContext } from '@/context/Message.context';
import { useHasAvailableIpBlocks } from '@/hooks/edge/useHasAvailableIpBlocks';
import { AddEdgeForm, EDGE_SCHEMAS } from '@/schemas/edge.schema';
import { InputField } from '@/components/form/InputField.component';
import { SelectField } from '@/components/form/SelectField.component';
import {
  EDGE_GATEWAY_NAME_MAX_LENGTH,
  EDGE_GATEWAY_NAME_MIN_LENGTH,
} from './adgeEdgeGateway.constants';

export default function AddEdgeGatewayPage() {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id, vdcId } = useParams();
  const navigate = useNavigate();
  const closeDrawer = () => navigate('..');
  const { addSuccess, addError } = useMessageContext();

  const {
    isLoading: isLoadingIpBlocks,
    hasAvailableIpBlocks,
    availableIpBlocks,
  } = useHasAvailableIpBlocks();

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
    resolver: zodResolver(EDGE_SCHEMAS.addEdge),
    defaultValues: {
      name: '',
      ipBlock: '',
    },
  });

  const onSubmit = (data: AddEdgeForm) => {
    const selectedIpBlock = availableIpBlocks.find(
      (b) => b.currentState.internalScope === data.ipBlock,
    );
    if (!selectedIpBlock) {
      addError({ content: t('edge_operation_error') });
      return;
    }

    addEdgeGateway({
      name: data.name,
      ipBlock: {
        id: selectedIpBlock.id,
        name: selectedIpBlock.currentState.name,
      },
    });
  };

  return (
    <Drawer
      isOpen
      heading={t('edge_add_title')}
      isLoading={isLoadingIpBlocks}
      primaryButtonLabel={t('edge_add_submit')}
      onPrimaryButtonClick={handleSubmit(onSubmit)}
      isPrimaryButtonLoading={isCreating}
      isPrimaryButtonDisabled={
        isLoadingIpBlocks || isCreating || !isValid || !hasAvailableIpBlocks
      }
      secondaryButtonLabel={tActions('cancel')}
      onSecondaryButtonClick={closeDrawer}
      onDismiss={closeDrawer}
    >
      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        {!isLoadingIpBlocks && !hasAvailableIpBlocks && (
          <OdsMessage color="warning" isDismissible={false}>
            {t('edge_add_ip_block_no_available')}
          </OdsMessage>
        )}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <InputField
              field={field}
              label={t('edge_add_input_name_label')}
              isDisabled={!hasAvailableIpBlocks}
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
          render={({ field, fieldState }) => (
            <SelectField
              field={field}
              label={t('edge_ip_block')}
              placeholder={t('edge_ip_block_select')}
              options={availableIpBlocks.map(
                (b) => b.currentState.internalScope,
              )}
              isDisabled={isLoadingIpBlocks || !hasAvailableIpBlocks}
              isLoading={isLoadingIpBlocks}
              error={fieldState.error && t('edge_add_input_ip_block_helper')}
            />
          )}
        />
      </form>
    </Drawer>
  );
}
