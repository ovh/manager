import React, { Suspense } from 'react';
import { Drawer } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useSecretWithData } from '@secret-manager/data/hooks/useSecret';
import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { CreateVersionDrawerForm } from './CreateVersionDrawerForm.component';
import { CREATE_VERSION_DRAWER_TEST_IDS } from './CreateVersionDrawer.constants';

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
