import React from 'react';
import z from 'zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Secret } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useUpdateSecret } from '@secret-manager/data/hooks/useUpdateSecret';
import { SecretDeactivateVersionAfterFormField } from '@secret-manager/components/form/SecretDeactivateVersionAfterFormField.component';
import {
  SecretCasRequiredFormField,
  casRequiredToFormValue,
  formValueToCasRequired,
} from '@secret-manager/components/form/SecretCasRequiredFormField.component';
import { SecretMaxVersionsFormField } from '@secret-manager/components/form/SecretMaxVersionsFormField.component';
import { SecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { useSecretMetadataSchema } from '@secret-manager/validation/metadata/metadataSchema';
import { addCurrentVersionToCas } from '@secret-manager/utils/cas';
import {
  DrawerContent,
  DrawerFooter,
} from '@/common/components/drawer/DrawerInnerComponents.component';

type EditMetadataDrawerFormProps = {
  secret: Secret;
  okmsId: string;
  secretPath: string;
  secretConfig: SecretSmartConfig;
  onDismiss: () => void;
};

export const EditMetadataDrawerForm = ({
  secret,
  okmsId,
  secretPath,
  secretConfig,
  onDismiss,
}: EditMetadataDrawerFormProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);

  const {
    mutateAsync: updateSecret,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateSecret();

  const metadataSchema = useSecretMetadataSchema();

  type FormSchema = z.infer<typeof metadataSchema>;
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      casRequired: casRequiredToFormValue(secret?.metadata.casRequired),
      deactivateVersionAfter: secret?.metadata.deactivateVersionAfter || '',
      maxVersions: secret?.metadata.maxVersions || 0,
    },
  });

  const handleSubmitForm = async (data: FormSchema) => {
    try {
      await updateSecret({
        okmsId,
        path: decodeSecretPath(secretPath),
        cas: addCurrentVersionToCas(
          secret?.metadata?.currentVersion,
          secretConfig.casRequired.value,
          formValueToCasRequired(data.casRequired),
        ),
        data: {
          metadata: {
            ...data,
            casRequired: formValueToCasRequired(data.casRequired),
          },
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
          <SecretMaxVersionsFormField name="maxVersions" control={control} />
          <SecretCasRequiredFormField
            name="casRequired"
            control={control}
            isCasRequiredSetOnOkms={secretConfig?.isCasRequiredSetOnOkms}
          />
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
