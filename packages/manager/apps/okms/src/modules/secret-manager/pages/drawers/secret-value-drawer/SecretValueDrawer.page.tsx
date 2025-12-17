import { Suspense, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { SecretValue } from '@secret-manager/components/secret-value/SecretValue.component';
import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { Drawer } from '@ovh-ux/manager-react-components';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { SECRET_VALUE_DRAWER_TEST_ID } from './SecretValueDrawer.constants';
import { VersionSelector } from './VersionSelector.component';

const SecretValueDrawerPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');
  const secretPathDecoded = decodeSecretPath(secretPath);
  const { versionId } = useParams();

  const { data: secret, isPending: isSecretPending } = useSecret(
    okmsId,
    decodeSecretPath(secretPath),
  );

  const [selectedVersion, setSelectedVersion] = useState<SecretVersion | undefined>(undefined);

  const isCurrentVersion = secret?.metadata.currentVersion === selectedVersion?.id;
  const hasVersion = secret?.metadata.currentVersion !== undefined;

  return (
    <Drawer
      data-testid={SECRET_VALUE_DRAWER_TEST_ID}
      heading={t('values')}
      onDismiss={() => {
        navigate('..');
      }}
      isLoading={isSecretPending}
      isOpen
    >
      <Suspense>
        {hasVersion && (
          <div className="flex flex-col gap-4 pb-10">
            <VersionSelector
              okmsId={okmsId}
              secretPath={secretPath}
              defaultVersionId={versionId}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
            />
            {isCurrentVersion && (
              <OdsMessage isDismissible={false}>{t('current_version')}</OdsMessage>
            )}
            {selectedVersion && selectedVersion.state === 'ACTIVE' && (
              <SecretValue
                okmsId={okmsId}
                secretPath={secretPathDecoded}
                version={selectedVersion}
              />
            )}
          </div>
        )}
        {!hasVersion && (
          <OdsMessage className="w-full" color="warning" isDismissible={false}>
            {t('no_version_message')}
          </OdsMessage>
        )}
      </Suspense>
    </Drawer>
  );
};

export default SecretValueDrawerPage;
