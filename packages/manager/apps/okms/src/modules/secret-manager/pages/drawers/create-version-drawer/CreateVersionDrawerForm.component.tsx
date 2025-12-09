import { zodResolver } from '@hookform/resolvers/zod';
import { SecretDataFormField } from '@secret-manager/components/form/secret-data-form-field/SecretDataFormField.component';
import { useCreateSecretVersion } from '@secret-manager/data/hooks/useCreateSecretVersion';
import { SecretVersionDataField, SecretWithData } from '@secret-manager/types/secret.type';
import { addCurrentVersionToCas } from '@secret-manager/utils/cas';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { SecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { useSecretDataSchema } from '@secret-manager/validation';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import {
  DrawerContent,
  DrawerFooter,
} from '@/common/components/drawer/DrawerInnerComponents.component';

import { VersionStatusMessage } from './VersionStatusMessage.component';

type CreateVersionDrawerFormProps = {
  secret: SecretWithData;
  okmsId: string;
  secretPath: string;
  secretConfig: SecretSmartConfig;
  onDismiss: () => void;
};

export const CreateVersionDrawerForm = ({
  secret,
  okmsId,
  secretPath,
  secretConfig,
  onDismiss,
}: CreateVersionDrawerFormProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);

  const {
    mutateAsync: createSecretVersion,
    isPending: isCreating,
    error: createError,
  } = useCreateSecretVersion();

  const dataAsString = JSON.stringify(secret?.version?.data);

  const dataSchema = useSecretDataSchema();
  const formSchema = z.object({ data: dataSchema });
  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm({
    mode: 'onChange', // Validation on all changes to show errors immediately
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: dataAsString,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = form;

  const handleSubmitForm = async (data: FormSchema) => {
    try {
      await createSecretVersion({
        okmsId,
        path: decodeSecretPath(secretPath),
        data: JSON.parse(data.data) as SecretVersionDataField,
        cas: addCurrentVersionToCas(
          secret?.metadata?.currentVersion,
          secretConfig.casRequired.value,
        ),
      });
      onDismiss();
    } catch {
      // Error is handled by the useCreateSecretVersion hook
    }
  };

  return (
    <div className="flex h-full flex-col">
      <DrawerContent>
        <FormProvider {...form}>
          <form
            className="m-1" // give room to display the outline of all inputs
          >
            {createError && (
              <OdsMessage color="danger" className="mb-4">
                {createError?.response?.data?.message || t('add_new_version_error')}
              </OdsMessage>
            )}
            <VersionStatusMessage state={secret.version.state} />
            <SecretDataFormField name="data" control={control} />
          </form>
        </FormProvider>
      </DrawerContent>
      <DrawerFooter
        primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:add`)}
        isPrimaryButtonDisabled={!isDirty || !isValid}
        isPrimaryButtonLoading={isCreating}
        onPrimaryButtonClick={handleSubmit(handleSubmitForm)}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:close`)}
        onSecondaryButtonClick={onDismiss}
      />
    </div>
  );
};
