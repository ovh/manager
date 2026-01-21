import { Suspense } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';

import { Drawer } from '@ovh-ux/muk';

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
    <Drawer.Root isOpen onDismiss={handleDismiss} isLoading={isPending}>
      <Drawer.Header title={t('edit_metadata')} />
      <Suspense>
        {error && (
          <Drawer.Content>
            <Message color="critical" className="mb-4" dismissible={false}>
              {error?.response?.data?.message}
            </Message>
          </Drawer.Content>
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
    </Drawer.Root>
  );
}
