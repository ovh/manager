import { zodResolver } from '@hookform/resolvers/zod';
import { KeyValuesEditor } from '@secret-manager/components/form/key-values-editor/KeyValuesEditor';
import { useUpdateSecret } from '@secret-manager/data/hooks/useUpdateSecret';
import { Secret } from '@secret-manager/types/secret.type';
import { addCurrentVersionToCas } from '@secret-manager/utils/cas';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import {
  DrawerContent,
  DrawerFooter,
} from '@/common/components/drawer/DrawerInnerComponents.component';

type EditCustomMetadataDrawerFormProps = {
  secret: Secret;
  okmsId: string;
  secretPath: string;
  onDismiss: () => void;
};

const customMetadataSchema = z.object({
  data: z.string(),
});

type FormSchema = z.infer<typeof customMetadataSchema>;

export const EditCustomMetadataDrawerForm = ({
  secret,
  okmsId,
  secretPath,
  onDismiss,
}: EditCustomMetadataDrawerFormProps) => {
  const { t } = useTranslation(['secret-manager', 'common', NAMESPACES.ACTIONS]);

  const {
    mutateAsync: updateSecret,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateSecret();

  const defaultData = secret?.metadata?.customMetadata
    ? JSON.stringify(secret.metadata.customMetadata)
    : '';

  const form = useForm<FormSchema>({
    resolver: zodResolver(customMetadataSchema),
    defaultValues: {
      data: defaultData,
    },
  });

  const { control, handleSubmit } = form;

  const handleSubmitForm = async ({ data }: FormSchema) => {
    try {
      const customMetadata = data ? (JSON.parse(data) as Record<string, string>) : undefined;

      await updateSecret({
        okmsId,
        path: decodeSecretPath(secretPath),
        cas: addCurrentVersionToCas(
          secret?.metadata?.currentVersion ?? 0,
          secret?.metadata?.casRequired ?? false,
        ),
        data: {
          metadata: {
            customMetadata: customMetadata,
          },
        },
      });
      onDismiss();
    } catch {
      // Error is handled by the useUpdateSecret hook
    }
  };

  return (
    <div className="flex h-full flex-col">
      <DrawerContent>
        <FormProvider {...form}>
          <form className="flex flex-col gap-4 p-1" onSubmit={handleSubmit(handleSubmitForm)}>
            {updateError && (
              <OdsMessage color="danger" className="mb-4">
                {updateError?.response?.data?.message || t('common:error_updating_data')}
              </OdsMessage>
            )}
            <KeyValuesEditor name="data" control={control} allowDeleteLastItem />
          </form>
        </FormProvider>
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
