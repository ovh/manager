import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Textarea,
  Button,
  Input,
  Icon,
} from '@ovhcloud/ods-react';
import {
  Controller,
  SubmitHandler,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addSshKeyFormSchema,
  TAddSshKeyForm,
} from '../../CreateInstance.schema';
import { TInstanceCreationForm } from '../../CreateInstance.page';

const AddSshKey: FC<{ openForm: boolean }> = ({ openForm }) => {
  const { t } = useTranslation('creation');
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(addSshKeyFormSchema),
    defaultValues: {
      sshName: '',
      sshKey: '',
    },
    mode: 'onChange',
  });
  const { setValue } = useFormContext<TInstanceCreationForm>();
  const [openSshKeyform, setOpenSshKeyForm] = useState<boolean>(openForm);

  const handleAddSshKey: SubmitHandler<TAddSshKeyForm> = ({
    sshName,
    sshKey,
  }) => {
    setValue('sshName', sshName);
    setValue('sshKey', sshKey);
    setOpenSshKeyForm(false);
  };

  const handleOpenSshKeyForm = () => setOpenSshKeyForm(true);

  if (!openSshKeyform)
    return (
      <Button variant="ghost" onClick={handleOpenSshKeyForm}>
        <Icon name="plus" />
        {t('creation:pci_instance_creation_select_sshKey_add_new')}
      </Button>
    );

  return (
    <form
      className="mt-4 max-w-[55%] flex flex-col gap-y-5"
      onSubmit={(e) => {
        void handleSubmit(handleAddSshKey)(e);
      }}
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
