import { zodResolver } from '@hookform/resolvers/zod';
import {
  SecretCasRequiredFormField,
  casRequiredToFormValue,
  formValueToCasRequired,
} from '@secret-manager/components/form/SecretCasRequiredFormField.component';
import { SecretDeactivateVersionAfterFormField } from '@secret-manager/components/form/SecretDeactivateVersionAfterFormField.component';
import { SecretMaxVersionsFormField } from '@secret-manager/components/form/SecretMaxVersionsFormField.component';
import { useUpdateSecret } from '@secret-manager/data/hooks/useUpdateSecret';
import { Secret } from '@secret-manager/types/secret.type';
import { addCurrentVersionToCas } from '@secret-manager/utils/cas';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { SecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { useSecretConfigSchema } from '@secret-manager/validation/secret-config/secretConfigSchema';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import {
  DrawerContent,
  DrawerFooter,
} from '@/common/components/drawer/DrawerInnerComponents.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

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
  const { trackClick } = useOkmsTracking();

  const {
    mutateAsync: updateSecret,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateSecret();

  const metadataSchema = useSecretConfigSchema();

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
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['edit', 'metadata', 'confirm'],
    });
    try {
      await updateSecret({
        okmsId,
        path: decodeSecretPath(secretPath),
        cas: addCurrentVersionToCas(
          secret?.metadata?.currentVersion ?? 0,
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

  const handleDismiss = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['edit', 'metadata', 'cancel'],
    });
    onDismiss();
  };

  return (
    <div className="flex h-full flex-col">
      <DrawerContent>
        <form className="flex flex-col gap-4 p-1" onSubmit={handleSubmit(handleSubmitForm)}>
          {updateError && (
            <OdsMessage color="danger" className="mb-4">
              {updateError?.response?.data?.message || t('error_update_settings')}
            </OdsMessage>
          )}
          <SecretDeactivateVersionAfterFormField name="deactivateVersionAfter" control={control} />
          <SecretMaxVersionsFormField name="maxVersions" control={control} okmsId={okmsId} />
          <SecretCasRequiredFormField name="casRequired" control={control} okmsId={okmsId} />
        </form>
      </DrawerContent>
      <DrawerFooter
        primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
        isPrimaryButtonLoading={isUpdating}
        onPrimaryButtonClick={handleSubmit(handleSubmitForm)}
        secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:close`)}
        onSecondaryButtonClick={handleDismiss}
      />
    </div>
  );
};
