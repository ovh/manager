import { Suspense } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { useSecretVersionWithData } from '@secret-manager/data/hooks/useSecretVersion';
import { useSecretSmartConfig } from '@secret-manager/hooks/useSecretSmartConfig';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { Drawer } from '@ovh-ux/manager-react-components';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { CREATE_VERSION_DRAWER_TEST_IDS } from './CreateVersionDrawer.constants';
import { CreateVersionDrawerForm } from './CreateVersionDrawerForm.component';

export default function CreateVersionDrawerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');

  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');
  const [searchParams] = useSearchParams();
  const versionId = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.versionId);

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

  // Version data is used to prefill the form with the previous value
  // Version is fetched only if versionId is provided
  const {
    data: version,
    isFetching: isVersionFetching, // use isFetching in case there is no versionId provided
    error: versionError,
  } = useSecretVersionWithData({
    okmsId,
    secretPath: decodeSecretPath(secretPath),
    version: versionId ? Number(versionId) : undefined,
  });

  const isLoading = isSecretPending || isSecretSmartConfigPending || isVersionFetching;
  const error = secretError || secretSmartConfigError || versionError;

  const handleDismiss = () => {
    navigate('..');
  };

  return (
    <Drawer
      isOpen
      heading={t('add_new_version')}
      onDismiss={handleDismiss}
      isLoading={isLoading && !error}
      data-testid={CREATE_VERSION_DRAWER_TEST_IDS.drawer}
    >
      <Suspense>
        {error && (
          <OdsMessage color="danger" className="mb-4" isDismissible={false}>
            {error?.response?.data?.message}
          </OdsMessage>
        )}
        {!error && !isLoading && secretConfig && (
          <CreateVersionDrawerForm
            okmsId={okmsId}
            secretPath={secretPath}
            version={version}
            currentVersionId={secret?.metadata.currentVersion}
            secretConfig={secretConfig}
            onDismiss={handleDismiss}
          />
        )}
      </Suspense>
    </Drawer>
  );
}
