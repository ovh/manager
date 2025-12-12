import { Suspense } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';

import { Drawer } from '@ovh-ux/muk';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { EDIT_CUSTOM_METADATA_DRAWER_TEST_IDS } from './EditCustomMetadataDrawer.constants';
import { EditCustomMetadataDrawerForm } from './EditCustomMetadataDrawerForm.component';

export default function EditCustomMetadataDrawer() {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  const {
    data: secret,
    isPending: isSecretPending,
    error: secretError,
  } = useSecret(okmsId, decodeSecretPath(secretPath));

  const customMetadata = secret?.metadata?.customMetadata;

  const handleDismiss = () => {
    navigate('..');
  };

  return (
    <Drawer.Root
      isOpen
      onDismiss={handleDismiss}
      isLoading={isSecretPending && !secretError}
      data-testid={EDIT_CUSTOM_METADATA_DRAWER_TEST_IDS.drawer}
    >
      <Drawer.Header
        title={customMetadata ? t('edit_custom_metadata') : t('add_custom_metadata')}
      />
      <Suspense>
        {secretError && (
          <Drawer.Content>
            <Message color="critical" className="mb-4" dismissible={false}>
              {secretError?.response?.data?.message}
            </Message>
          </Drawer.Content>
        )}
        {!secretError && secret && (
          <EditCustomMetadataDrawerForm
            secret={secret}
            okmsId={okmsId}
            secretPath={secretPath}
            onDismiss={handleDismiss}
          />
        )}
      </Suspense>
    </Drawer.Root>
  );
}
