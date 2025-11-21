import { FC, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Textarea,
  Button,
  Input,
  Text,
} from '@ovhcloud/ods-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  buildAddSshKeyFormSchema,
  TAddSshKeyForm,
} from '../../CreateInstance.schema';

type TAddSshKeyProps = {
  unavailableSshKeyIds: string[];
  onSubmit: SubmitHandler<TAddSshKeyForm>;
  onCancel: () => void;
};

const AddSshKey: FC<TAddSshKeyProps> = ({
  onSubmit,
  onCancel,
  unavailableSshKeyIds,
}) => {
  const { t } = useTranslation([
    'creation',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(
      buildAddSshKeyFormSchema({
        unavailableSshKeyIds,
        unavailableNameError: t(
          'creation:pci_instance_creation_select_sshKey_add_name_unavailable_error',
        ),
        requiredMessageError: t(`${NAMESPACES.FORM}:error_required_field`),
      }),
    ),
    defaultValues: {
      sshKeyId: '',
      sshPublicKey: '',
    },
    mode: 'onChange',
  });

  const handleResetAddSshKeyForm = () => reset();

  const handleCancelAddSshKey = () => {
    handleResetAddSshKeyForm();
    onCancel();
  };

  const handleAddSshKey = (event: FormEvent) => {
    void handleSubmit(onSubmit)(event);
    handleResetAddSshKeyForm();
  };

  return (
    <form
      className="mt-4 max-w-[55%] flex flex-col gap-y-5"
      onSubmit={handleAddSshKey}
    >
      <Controller
        control={control}
        name="sshKeyId"
        render={({ field, fieldState }) => (
          <div>
            <FormField>
              <FormFieldLabel>
                {t(
                  'creation:pci_instance_creation_select_sshKey_add_name_label',
                )}
              </FormFieldLabel>
              <Input invalid={fieldState.invalid} {...field} />
            </FormField>
            {fieldState.error?.message && (
              <Text
                className="text-sm text-[--ods-color-critical-500]"
                preset="span"
              >
                {fieldState.error.message}
              </Text>
            )}
          </div>
        )}
      />
      <Controller
        control={control}
        name="sshPublicKey"
        render={({ field, fieldState }) => (
          <FormField>
            <FormFieldLabel>
              {t('creation:pci_instance_creation_select_sshKey_add_key_label')}
            </FormFieldLabel>
            <Textarea
              className="min-h-40"
              invalid={fieldState.invalid}
              {...field}
            />
            <FormFieldHelper className="text-[--ods-color-text] text-xs mt-4">
              {t(
                'creation:pci_instance_creation_select_sshKey_add_key_description',
              )}
            </FormFieldHelper>
          </FormField>
        )}
      />
      <div className="flex gap-x-6">
        <Button variant="outline" size="sm" onClick={handleCancelAddSshKey}>
          {t(`${NAMESPACES.ACTIONS}:cancel`)}
        </Button>
        <Button disabled={!isValid} variant="outline" size="sm" type="submit">
          {t('creation:pci_instance_creation_select_sshKey_add_key_submit_btn')}
        </Button>
      </div>
    </form>
  );
};

export default AddSshKey;
