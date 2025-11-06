import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { SecretDeactivateVersionAfterFormField } from '@secret-manager/components/form/SecretDeactivateVersionAfterFormField.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  casRequiredToFormValue,
  formValueToCasRequired,
  SecretCasRequiredFormField,
} from '@secret-manager/components/form/SecretCasRequiredFormField.component';
import {
  SecretConfig,
  SecretConfigReference,
} from '@secret-manager/types/secret.type';
import z from 'zod';
import { SecretMaxVersionsFormField } from '@secret-manager/components/form/SecretMaxVersionsFormField.component';
import { useUpdateSecretConfigOkms } from '@secret-manager/data/hooks/useUpdateSecretConfigOkms';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useSecretConfigSchema } from '@secret-manager/validation/secret-config/secretConfigSchema';
import {
  DrawerContent,
  DrawerFooter,
} from '@/common/components/drawer/DrawerInnerComponents.component';

type EditOkmsSecretConfigDrawerFormProps = {
  okmsId: string;
  secretConfig: SecretConfig;
  secretConfigReference: SecretConfigReference;
  onDismiss: () => void;
};

export const EditOkmsSecretConfigDrawerForm = ({
  okmsId,
  secretConfig,
  secretConfigReference,
  onDismiss,
}: EditOkmsSecretConfigDrawerFormProps) => {
  const { t } = useTranslation([
    'key-management-service/dashboard',
    NAMESPACES.ACTIONS,
  ]);

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
    <div className="flex flex-col h-full">
      <DrawerContent>
        <form className="flex flex-col gap-4">
          {updateError && (
            <OdsMessage color="danger" className="mb-4">
              {updateError?.response?.data?.message ||
                t('error_update_settings')}
            </OdsMessage>
          )}
          <SecretDeactivateVersionAfterFormField
            name="deactivateVersionAfter"
            control={control}
          />
          <SecretMaxVersionsFormField
            name="maxVersions"
            control={control}
            defaultMaxVersions={secretConfigReference.maxVersions}
          />
          <SecretCasRequiredFormField name="casRequired" control={control} />
        </form>
      </DrawerContent>
      <DrawerFooter
        primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
        isPrimaryButtonLoading={isUpdating}
        onPrimaryButtonClick={handleSubmit(handleSubmitForm)}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:close`)}
        onSecondaryButtonClick={onDismiss}
      />
    </div>
  );
};
