import { FC, useEffect } from 'react';
import {
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  FormFieldLabel,
  Icon,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import Banner from '@/components/banner/Banner.component';
import { InputField, ErrorText } from '@/components/form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import { selectOvhPrivateNetwork } from '../../view-models/networksViewModel';
import { usePrivateNetworks } from '@/data/hooks/configuration/usePrivateNetworks';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { selectMicroRegionDeploymentMode } from '../../view-models/microRegionsViewModel';

type AddNetworkFormProps = {
  isMetal: boolean;
};

const AddNetworkForm: FC<AddNetworkFormProps> = ({ isMetal }) => {
  const { t } = useTranslation('creation');
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext<TInstanceCreationForm>();
  const [microRegion, vlanId, enableDhcp] = useWatch({
    control,
    name: [
      'microRegion',
      'newPrivateNetwork.vlanId',
      'newPrivateNetwork.enableDhcp',
    ],
  });

  const { data: networks } = usePrivateNetworks({
    select: selectOvhPrivateNetwork(microRegion),
  });

  const { data: deploymentMode } = useInstancesCatalogWithSelect({
    select: selectMicroRegionDeploymentMode(microRegion),
  });

  const isLocalZone = deploymentMode === 'localzone';

  const handleEnableDhcp = (
    field: ControllerRenderProps<
      TInstanceCreationForm,
      'newPrivateNetwork.enableDhcp'
    >,
  ) => (detail: CheckboxCheckedChangeDetail) => {
    field.onChange(detail.checked);
  };

  useEffect(() => {
    if (networks) {
      let network;
      if (isMetal) {
        network = {
          ...networks.ovhPrivateNetwork,
          vlanId: 0,
        };
      } else if (isLocalZone) {
        network = { ...networks.ovhPrivateNetwork, vlanId: null };
      } else {
        network = networks.ovhPrivateNetwork;
      }
      setValue('newPrivateNetwork', network, {
        shouldValidate: true,
      });
    }
    setValue('willGatewayBeAttached', false);
  }, [networks, isLocalZone, isMetal, setValue]);

  return (
    <form
      className="mt-6 "
      aria-label={t('creation:pci_instance_creation_network_add_new')}
    >
      {!!vlanId && networks?.allocatedVlanIds.includes(vlanId) && (
        <Banner color="warning" className="mb-6">
          {t(
            'creation:pci_instance_creation_network_add_new_used_vlanID_warning',
          )}
        </Banner>
      )}
      {vlanId === 0 && !isMetal && (
        <Banner color="warning" className="mb-6">
          {t('creation:pci_instance_creation_network_add_new_vlanID_warning')}
        </Banner>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        <InputField
          label={t(
            'creation:pci_instance_creation_network_add_new_name_label_form',
          )}
          invalid={!!errors.newPrivateNetwork?.name}
          errorMessage={t(errors.newPrivateNetwork?.name?.message ?? '')}
          {...register('newPrivateNetwork.name')}
        />
        {!isLocalZone && (
          <FormField invalid={!!errors.newPrivateNetwork?.vlanId}>
            <FormFieldLabel className="items-center">
              {t(
                'creation:pci_instance_creation_network_add_new_vlanID_label_form',
              )}
              {isMetal && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-1 inline-flex cursor-help">
                      <Icon name="circle-info" aria-label="Info" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent withArrow>
                    {t(
                      'creation:pci_instance_creation_network_metal_vlanid_tooltip',
                    )}
                  </TooltipContent>
                </Tooltip>
              )}
            </FormFieldLabel>
            <Input
              type="number"
              disabled={isMetal}
              invalid={!!errors.newPrivateNetwork?.vlanId}
              {...register('newPrivateNetwork.vlanId', {
                valueAsNumber: true,
              })}
            />
            {errors.newPrivateNetwork?.vlanId && (
              <ErrorText>
                {t(errors.newPrivateNetwork.vlanId.message ?? '')}
              </ErrorText>
            )}
          </FormField>
        )}
        <InputField
          label={t(
            'creation:pci_instance_creation_network_add_new_cidr_label_form',
          )}
          invalid={!!errors.newPrivateNetwork?.cidr}
          errorMessage={t(
            'creation:pci_instance_creation_network_add_new_cidr_error',
          )}
          {...register('newPrivateNetwork.cidr')}
        />
      </div>
      <Controller
        control={control}
        name="newPrivateNetwork.enableDhcp"
        render={({ field }) => (
          <Checkbox
            checked={enableDhcp}
            onCheckedChange={handleEnableDhcp(field)}
            className="mt-6"
          >
            <CheckboxControl />
            <CheckboxLabel className="text-[var(--ods-color-text)]">
              {t(
                'creation:pci_instance_creation_network_add_new_dhcp_label_form',
              )}
            </CheckboxLabel>
          </Checkbox>
        )}
      />
    </form>
  );
};

export default AddNetworkForm;
