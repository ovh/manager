import { Suspense } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { Drawer } from '@ovh-ux/manager-react-components';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { EditMetadataDrawerForm } from './EditMetadataDrawerForm.component';

export default function EditMetadataDrawerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  const {
    data: secret,
    isPending: isSecretPending,
    error: secretError,
  } = useSecret(okmsId, decodeSecretPath(secretPath));

  const {
    secretConfig,
    isPending: isSecretSmartConfigPending,
    error: secretSmartConfigError,
  } = useSecretSmartConfig({ secret, okmsId });

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
        {!error && secret && secretConfig && (
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
