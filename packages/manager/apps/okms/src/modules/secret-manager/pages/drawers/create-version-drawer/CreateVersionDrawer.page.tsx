import React, { Suspense } from 'react';
import z from 'zod';
import { Drawer } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useSecretDataSchema } from '@secret-manager/validation';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { SecretWithData } from '@secret-manager/types/secret.type';
import { useSecretWithData } from '@secret-manager/data/hooks/useSecret';
import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useCreateSecretVersion } from '@secret-manager/data/hooks/useCreateSecretVersion';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { SecretDataFormField } from '@secret-manager/components/form/SecretDataFormField.component';
import { SecretSmartConfig } from '@secret-manager/utils/secretSmartConfig';
import { addCurrentVersionToCas } from '@secret-manager/utils/cas';
import {
  DrawerContent,
  DrawerFooter,
} from '@/common/components/drawer/DrawerInnerComponents.component';
import { VersionStatusMessage } from './VersionStatusMessage.component';
import { CREATE_VERSION_DRAWER_TEST_IDS } from './CreateVersionDrawer.constants';

type CreateVersionDrawerProps = {
  secret: SecretWithData;
  okmsId: string;
  secretPath: string;
  secretConfig: SecretSmartConfig;
  onDismiss: () => void;
};

const CreateVersionDrawerForm = ({
  secret,
  okmsId,
  secretPath,
  secretConfig,
  onDismiss,
}: CreateVersionDrawerProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);

  const {
    mutateAsync: createSecretVersion,
    isPending: isCreating,
    error: createError,
  } = useCreateSecretVersion();

  const dataSchema = useSecretDataSchema();
  const formSchema = z.object({ data: dataSchema });
  type FormSchema = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm({
    mode: 'onChange', // Validation on all changes to show errors immediately
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: JSON.stringify(secret?.version?.data),
    },
  });

  const handleSubmitForm = async (data: FormSchema) => {
    try {
      await createSecretVersion({
        okmsId,
        path: decodeSecretPath(secretPath),
        data: JSON.parse(data.data),
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
    <div className="flex flex-col h-full">
      <DrawerContent>
        <form>
          {createError && (
            <OdsMessage color="danger" className="mb-4">
              {createError?.response?.data?.message ||
                t('add_new_version_error')}
            </OdsMessage>
          )}
          <VersionStatusMessage state={secret.version.state} />
          <SecretDataFormField name="data" control={control} />
        </form>
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

export default function CreateVersionDrawerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  const { okmsId, secretPath } = useParams<LocationPathParams>();

  const {
    data: secret,
    isPending: isSecretPending,
    error: secretError,
  } = useSecretWithData(okmsId, decodeSecretPath(secretPath));

  const {
    secretConfig,
    isPending: isSecretSmartConfigPending,
    error: secretSmartConfigError,
  } = useSecretSmartConfig(secret);

  const isPending = isSecretPending || isSecretSmartConfigPending;
  const error = secretError || secretSmartConfigError;

  const handleDismiss = () => {
    navigate('..');
  };

  return (
    <Drawer
      isOpen
      heading={t('add_new_version')}
      onDismiss={handleDismiss}
      isLoading={isPending}
      data-testid={CREATE_VERSION_DRAWER_TEST_IDS.drawer}
    >
      <Suspense>
        {error && (
          <OdsMessage color="danger" className="mb-4" isDismissible={false}>
            {error?.response?.data?.message}
          </OdsMessage>
        )}
        {!error && secret && (
          <CreateVersionDrawerForm
            secret={secret}
            okmsId={okmsId}
            secretPath={secretPath}
            secretConfig={secretConfig}
            onDismiss={handleDismiss}
          />
        )}
      </Suspense>
    </Drawer>
  );
}
