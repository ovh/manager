import React, { Suspense } from 'react';
import z from 'zod';
import { Drawer, ErrorBanner } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useSecretDataSchema } from '@secret-manager/validation';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { SecretWithData } from '@secret-manager/types/secret.type';
import { useSecretWithData } from '@secret-manager/data/hooks/useSecret';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useCreateSecretVersion } from '@secret-manager/data/hooks/useCreateSecretVersion';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { SecretDataFormField } from '@secret-manager/components/form/SecretDataFormField.component';
import {
  DrawerContent,
  DrawerFooter,
} from '@/common/components/drawer/DrawerInnerComponents.component';

type CreateVersionDrawerProps = {
  secret: SecretWithData;
  domainId: string;
  secretPath: string;
  onDismiss: () => void;
};

const CreateVersionDrawerForm = ({
  secret,
  domainId,
  secretPath,
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
    await createSecretVersion({
      okmsId: domainId,
      path: decodeSecretPath(secretPath),
      data: JSON.parse(data.data),
    });
    onDismiss();
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

  const { domainId, secretPath } = useParams<LocationPathParams>();

  const {
    data: secret,
    isPending: isSecretPending,
    error: secretError,
    refetch,
  } = useSecretWithData(domainId, decodeSecretPath(secretPath));

  const handleDismiss = () => {
    navigate('..');
  };

  if (secretError) {
    return (
      <ErrorBanner
        error={secretError.response}
        onRedirectHome={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretManagerOnboarding)
        }
        onReloadPage={refetch}
      />
    );
  }

  return (
    <Drawer
      isOpen
      heading={t('add_new_version')}
      onDismiss={handleDismiss}
      isLoading={isSecretPending}
      data-testid="create-version-drawer"
    >
      <Suspense>
        {secret && (
          <CreateVersionDrawerForm
            secret={secret}
            domainId={domainId}
            secretPath={secretPath}
            onDismiss={handleDismiss}
          />
        )}
      </Suspense>
    </Drawer>
  );
}
