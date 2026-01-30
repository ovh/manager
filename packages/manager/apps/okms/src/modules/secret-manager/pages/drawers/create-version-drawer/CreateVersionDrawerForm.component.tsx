import { zodResolver } from '@hookform/resolvers/zod';
import { SecretDataFormField } from '@secret-manager/components/form/secret-data-form-field/SecretDataFormField.component';
import { useCreateSecretVersion } from '@secret-manager/data/hooks/useCreateSecretVersion';
import { SecretVersionDataField, SecretVersionWithData } from '@secret-manager/types/secret.type';
import { addCurrentVersionToCas } from '@secret-manager/utils/cas';
import { safeJsonParse, safeJsonStringify } from '@secret-manager/utils/json';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { SecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { useSecretDataSchema } from '@secret-manager/validation';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

import { Message } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Drawer } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { VersionStatusMessage } from './VersionStatusMessage.component';

type CreateVersionDrawerFormProps = {
  okmsId: string;
  secretPath: string;
  version?: SecretVersionWithData;
  currentVersionId?: number;
  secretConfig: SecretSmartConfig;
  onDismiss: () => void;
};

export const CreateVersionDrawerForm = ({
  okmsId,
  secretPath,
  version,
  currentVersionId,
  secretConfig,
  onDismiss,
}: CreateVersionDrawerFormProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const { trackClick } = useOkmsTracking();

  const {
    mutateAsync: createSecretVersion,
    isPending: isCreating,
    error: createError,
  } = useCreateSecretVersion();

  const dataAsString = safeJsonStringify(version?.data);

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
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['create', 'version', 'confirm'],
    });
    try {
      await createSecretVersion({
        okmsId,
        path: decodeSecretPath(secretPath),
        data: safeJsonParse<SecretVersionDataField>(data.data),
        cas: addCurrentVersionToCas(
          // No currentVersionId means there is no version yet, so we use 0 for CAS
          currentVersionId ?? 0,
          secretConfig.casRequired.value,
        ),
      });
      onDismiss();
    } catch {
      // Error is handled by the useCreateSecretVersion hook
    }
  };

  const handleDismiss = () => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['create', 'version', 'cancel'],
    });
    onDismiss();
  };

  return (
    <>
      <Drawer.Content>
        <FormProvider {...form}>
          <form
            className="m-1" // give room to display the outline of all inputs
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            {createError && (
              <Message color="critical" className="mb-4">
                {createError?.response?.data?.message || t('add_new_version_error')}
              </Message>
            )}
            {version && <VersionStatusMessage state={version.state} />}
            <SecretDataFormField name="data" control={control} />
          </form>
        </FormProvider>
      </Drawer.Content>
      <Drawer.Footer
        primaryButton={{
          label: t(`${NAMESPACES.ACTIONS}:add`),
          isDisabled: !isDirty || !isValid,
          isLoading: isCreating,
          onClick: handleSubmit(handleSubmitForm),
        }}
        secondaryButton={{
          label: t(`${NAMESPACES.ACTIONS}:close`),
          onClick: handleDismiss,
        }}
      />
    </>
  );
};
