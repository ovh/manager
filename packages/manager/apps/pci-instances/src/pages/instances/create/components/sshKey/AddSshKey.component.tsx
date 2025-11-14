import { FC, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Textarea,
  Button,
  Input,
} from '@ovhcloud/ods-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addSshKeyFormSchema,
  TAddSshKeyForm,
} from '../../CreateInstance.schema';

const AddSshKey: FC<{ onSubmit: SubmitHandler<TAddSshKeyForm> }> = ({
  onSubmit,
}) => {
  const { t } = useTranslation('creation');
  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(addSshKeyFormSchema),
    defaultValues: {
      sshName: '',
      sshKey: '',
    },
    mode: 'onChange',
  });

  const handleAddSshKey = (event: FormEvent) => {
    void handleSubmit(onSubmit)(event);
    reset();
  };

  return (
    <form
      className="mt-4 max-w-[55%] flex flex-col gap-y-5"
      onSubmit={handleAddSshKey}
    >
      <Controller
        control={control}
        name="sshName"
        render={({ field, fieldState }) => (
          <FormField>
            <FormFieldLabel>
              {t('creation:pci_instance_creation_select_sshKey_add_name_label')}
            </FormFieldLabel>
            <Input invalid={fieldState.invalid} {...field} />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name="sshKey"
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
      <Button
        disabled={!isValid}
        variant="outline"
        size="sm"
        className="self-start"
        type="submit"
      >
        {t('creation:pci_instance_creation_select_sshKey_add_key_submit_btn')}
      </Button>
    </form>
  );
};

export default AddSshKey;
