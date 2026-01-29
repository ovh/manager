import { FC, useEffect } from 'react';
import {
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxControl,
  CheckboxLabel,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import Banner from '@/components/banner/Banner.component';
import { InputField } from '@/components/form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import { selectOvhPrivateNetwork } from '../../view-models/networksViewModel';
import { usePrivateNetworks } from '@/data/hooks/configuration/usePrivateNetworks';

const AddNetworkForm: FC = () => {
  const { t } = useTranslation('creation');
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext<TInstanceCreationForm>();
  const [microRegion, vlanId] = useWatch({
    control,
    name: ['microRegion', 'newPrivateNetwork.vlanId'],
  });

  const { data: networks } = usePrivateNetworks({
    select: selectOvhPrivateNetwork(microRegion),
  });

  const handleEnableDhcp = (
    field: ControllerRenderProps<
      TInstanceCreationForm,
      'newPrivateNetwork.enableDhcp'
    >,
  ) => (detail: CheckboxCheckedChangeDetail) => {
    field.onChange(detail.checked);
  };

  useEffect(() => {
    if (networks)
      setValue('newPrivateNetwork', networks.ovhPrivateNetwork, {
        shouldValidate: true,
      });

    return () => {
      setValue('newPrivateNetwork', null);
    };
  }, [networks, setValue]);

  return (
    <form
      className="mt-6"
      aria-label={t('creation:pci_instance_creation_network_add_new')}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        <InputField
          label={t(
            'creation:pci_instance_creation_network_add_new_name_label_form',
          )}
          invalid={!!errors.newPrivateNetwork?.name}
          errorMessage={t(errors.newPrivateNetwork?.name?.message ?? '')}
          {...register('newPrivateNetwork.name')}
        />
        <InputField
          label={t(
            'creation:pci_instance_creation_network_add_new_vlanID_label_form',
          )}
          invalid={!!errors.newPrivateNetwork?.vlanId}
          errorMessage={t(errors.newPrivateNetwork?.vlanId?.message ?? '')}
          type="number"
          {...register('newPrivateNetwork.vlanId', { valueAsNumber: true })}
        />
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
            checked={field.value}
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
      {networks?.allocatedVlanIds.includes(vlanId) && (
        <Banner color="warning" className="mt-6">
          {t(
            'creation:pci_instance_creation_network_add_new_used_vlanID_warning',
          )}
        </Banner>
      )}
      {vlanId === 0 && (
        <Banner color="warning" className="mt-6">
          {t('creation:pci_instance_creation_network_add_new_vlanID_warning')}
        </Banner>
      )}
    </form>
  );
};

export default AddNetworkForm;
