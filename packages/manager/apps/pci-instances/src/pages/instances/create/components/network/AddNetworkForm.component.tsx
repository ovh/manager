import { ChangeEvent, FC, useEffect } from 'react';
import {
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  FormFieldLabel,
  Input,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  ControllerRenderProps,
  useForm,
  useWatch,
} from 'react-hook-form';
import { networkSchema, TAddNetworkForm } from '../../CreateInstance.schema';
import Banner from '@/components/banner/Banner.component';

type TAddNetworkFormProps = {
  values: TAddNetworkForm;
  takenVlanIds?: number[];
  onValuesChange?: (values: TAddNetworkForm) => void;
};

const AddNetworkForm: FC<TAddNetworkFormProps> = ({
  values: { name, vlanId: defaultVlanId, cidr, enableDhcp },
  onValuesChange,
  takenVlanIds = [],
}) => {
  const { t } = useTranslation('creation');

  const { control, subscribe } = useForm({
    resolver: zodResolver(networkSchema),
    defaultValues: {
      name,
      vlanId: defaultVlanId,
      cidr,
      enableDhcp,
    },
    mode: 'onChange',
  });
  const vlanId = useWatch({
    control,
    name: 'vlanId',
  });

  const handleVlanIdChange = (
    field: ControllerRenderProps<TAddNetworkForm, 'vlanId'>,
  ) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    field.onChange(value);
  };

  const handleEnableDhcp = (
    field: ControllerRenderProps<TAddNetworkForm, 'enableDhcp'>,
  ) => (detail: CheckboxCheckedChangeDetail) => {
    field.onChange(detail.checked);
  };

  useEffect(() => {
    const formHandler = subscribe({
      formState: { values: true },
      callback: ({ values }) => onValuesChange?.(values),
    });

    return () => formHandler();
  }, [onValuesChange, subscribe]);

  return (
    <form
      className="mt-6"
      aria-label={t('creation:pci_instance_creation_network_add_new')}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <FormField>
              <FormFieldLabel>
                {t(
                  'creation:pci_instance_creation_network_add_new_name_label_form',
                )}
              </FormFieldLabel>
              <Input invalid={fieldState.invalid} {...field} />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="vlanId"
          render={({ field, fieldState }) => (
            <FormField>
              <FormFieldLabel>
                {t(
                  'creation:pci_instance_creation_network_add_new_vlanID_label_form',
                )}
              </FormFieldLabel>
              <Input
                {...field}
                invalid={fieldState.invalid}
                onChange={handleVlanIdChange(field)}
                type="number"
              />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="cidr"
          render={({ field, fieldState }) => (
            <div>
              <FormField>
                <FormFieldLabel>
                  {t(
                    'creation:pci_instance_creation_network_add_new_cidr_label_form',
                  )}
                </FormFieldLabel>
                <Input invalid={fieldState.invalid} {...field} />
              </FormField>
              {fieldState.invalid && (
                <Text
                  className="text-sm text-[--ods-color-critical-500]"
                  preset="span"
                >
                  {t(
                    'creation:pci_instance_creation_network_add_new_cidr_error',
                  )}
                </Text>
              )}
            </div>
          )}
        />
      </div>
      <Controller
        control={control}
        name="enableDhcp"
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
      {takenVlanIds.includes(vlanId) && (
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
