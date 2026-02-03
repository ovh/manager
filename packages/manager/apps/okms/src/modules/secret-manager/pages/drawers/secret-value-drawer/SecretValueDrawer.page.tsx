import { Suspense, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { SecretValue } from '@secret-manager/components/secret-value/SecretValue.component';
import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';

import { Drawer } from '@ovh-ux/muk';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

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
    <Drawer.Root
      onDismiss={() => {
        navigate('..');
      }}
      isLoading={isSecretPending}
      isOpen
    >
      <Drawer.Header title={t('values')} />
      <Drawer.Content>
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
                <Message className="w-fit" dismissible={false}>
                  {t('current_version')}
                </Message>
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
            <Message className="w-full" color="warning" dismissible={false}>
              {t('no_version_message')}
            </Message>
          )}
        </Suspense>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default SecretValueDrawerPage;
