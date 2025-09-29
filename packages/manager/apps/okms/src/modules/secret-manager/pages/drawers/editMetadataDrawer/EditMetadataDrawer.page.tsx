import React, { Suspense } from 'react';
import { Drawer } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { EditMetadataDrawerForm } from './EditMetadataDrawerForm.component';

export default function EditMetadataDrawerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  const { okmsId, secretPath } = useParams<LocationPathParams>();

  const {
    data: secret,
    isPending: isSecretPending,
    error: secretError,
  } = useSecret(okmsId, decodeSecretPath(secretPath));

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
      heading={t('edit_metadata')}
      onDismiss={handleDismiss}
      isLoading={isPending}
      data-testid="edit-metadata-drawer"
    >
      <Suspense>
        {error && (
          <OdsMessage color="danger" className="mb-4" isDismissible={false}>
            {error?.response?.data?.message}
          </OdsMessage>
        )}
        {!error && secret && (
          <EditMetadataDrawerForm
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
