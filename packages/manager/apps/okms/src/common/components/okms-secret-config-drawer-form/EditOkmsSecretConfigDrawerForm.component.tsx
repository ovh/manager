import { zodResolver } from '@hookform/resolvers/zod';
import {
  SecretCasRequiredFormField,
  casRequiredToFormValue,
  formValueToCasRequired,
} from '@secret-manager/components/form/SecretCasRequiredFormField.component';
import { SecretDeactivateVersionAfterFormField } from '@secret-manager/components/form/SecretDeactivateVersionAfterFormField.component';
import { SecretMaxVersionsFormField } from '@secret-manager/components/form/SecretMaxVersionsFormField.component';
import { useUpdateSecretConfigOkms } from '@secret-manager/data/hooks/useUpdateSecretConfigOkms';
import { SecretConfig } from '@secret-manager/types/secret.type';
import { useSecretConfigSchema } from '@secret-manager/validation/secret-config/secretConfigSchema';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

import { Message } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/muk';

type EditOkmsSecretConfigDrawerFormProps = {
  okmsId: string;
  secretConfig: SecretConfig;
  onDismiss: () => void;
};

export const EditOkmsSecretConfigDrawerForm = ({
  okmsId,
  secretConfig,
  onDismiss,
}: EditOkmsSecretConfigDrawerFormProps) => {
  const { t } = useTranslation(['key-management-service/dashboard', NAMESPACES.ACTIONS]);

  const {
    mutateAsync: updateSecretConfigOkms,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateSecretConfigOkms();

  const secretConfigSchema = useSecretConfigSchema();

  type FormSchema = z.infer<typeof secretConfigSchema>;
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(secretConfigSchema),
    defaultValues: {
      casRequired: casRequiredToFormValue(secretConfig.casRequired),
      deactivateVersionAfter: secretConfig.deactivateVersionAfter || '',
      maxVersions: secretConfig.maxVersions || 0,
    },
  });

  const handleSubmitForm = async (data: FormSchema) => {
    try {
      await updateSecretConfigOkms({
        okmsId,
        secretConfig: {
          ...data,
          casRequired: formValueToCasRequired(data.casRequired),
        },
      });
      onDismiss();
    } catch {
      // Error is handled by the useUpdateSecret hook
    }
  };

  return (
    <>
      <Drawer.Content>
        <form className="flex flex-col gap-4 p-1" onSubmit={handleSubmit(handleSubmitForm)}>
          {updateError && (
            <Message color="critical" className="mb-4">
              {updateError?.response?.data?.message || t('error_update_settings')}
            </Message>
          )}
          <SecretDeactivateVersionAfterFormField name="deactivateVersionAfter" control={control} />
          <SecretMaxVersionsFormField name="maxVersions" control={control} okmsId={okmsId} />
          <SecretCasRequiredFormField name="casRequired" control={control} />
        </form>
      </Drawer.Content>
      <Drawer.Footer
        primaryButton={{
          label: t(`${NAMESPACES.ACTIONS}:validate`),
          isLoading: isUpdating,
          onClick: handleSubmit(handleSubmitForm),
        }}
        secondaryButton={{
          label: t(`${NAMESPACES.ACTIONS}:close`),
          onClick: onDismiss,
        }}
      />
    </>
  );
};
