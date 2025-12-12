import { zodResolver } from '@hookform/resolvers/zod';
import { KeyValuesEditor } from '@secret-manager/components/form/key-values-editor/KeyValuesEditor';
import { useUpdateSecret } from '@secret-manager/data/hooks/useUpdateSecret';
import { Secret } from '@secret-manager/types/secret.type';
import { addCurrentVersionToCas } from '@secret-manager/utils/cas';
import { safeJsonParse, safeJsonStringify } from '@secret-manager/utils/json';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useCustomMetadataSchema } from '@secret-manager/validation/custom-metadata/customMetadataSchema';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';

import { Message } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Drawer } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

type EditCustomMetadataDrawerFormProps = {
  secret: Secret;
  okmsId: string;
  secretPath: string;
  onDismiss: () => void;
};

export const EditCustomMetadataDrawerForm = ({
  secret,
  okmsId,
  secretPath,
  onDismiss,
}: EditCustomMetadataDrawerFormProps) => {
  const { t } = useTranslation(['secret-manager', 'common', NAMESPACES.ACTIONS]);
  const { trackClick } = useOkmsTracking();

  const {
    mutateAsync: updateSecret,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateSecret();

  const dataSchema = useCustomMetadataSchema();
  const formSchema = z.object({ data: dataSchema });
  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Validation on all changes to show errors immediately
    defaultValues: {
      data: safeJsonStringify(secret.metadata.customMetadata),
    },
  });

  const { control, handleSubmit } = form;

  const handleSubmitForm = async ({ data }: FormSchema) => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['edit', 'custom', 'metadata', 'confirm'],
    });
    try {
      const customMetadata = safeJsonParse<Record<string, string>>(data);

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

  const handleDismiss = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['edit', 'custom', 'metadata', 'cancel'],
    });
    onDismiss();
  };

  return (
    <>
      <Drawer.Content>
        <FormProvider {...form}>
          <form className="flex flex-col gap-4 p-1" onSubmit={handleSubmit(handleSubmitForm)}>
            {updateError && (
              <Message color="critical" className="mb-4">
                {updateError?.response?.data?.message || t('common:error_updating_data')}
              </Message>
            )}
            <KeyValuesEditor name="data" control={control} allowDeleteLastItem />
          </form>
        </FormProvider>
      </Drawer.Content>
      <Drawer.Footer
        primaryButton={{
          label: t(`${NAMESPACES.ACTIONS}:validate`),
          isLoading: isUpdating,
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
