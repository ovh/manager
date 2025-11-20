import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useSecret } from '@secret-manager/data/hooks/useSecret';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { Drawer } from '@ovh-ux/manager-react-components';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { SecretRawValue } from './SecretRawValue.component';
import { SECRET_VALUE_DRAWER_TEST_ID } from './SecretValueDrawer.constants';
import { VersionSelector } from './VersionSelector.component';

const useIsCurrentVersion = (version: SecretVersion | undefined) => {
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');
  const { data: secret } = useSecret(okmsId, decodeSecretPath(secretPath));

  if (!version || !secret) {
    return false;
  }
  return secret.metadata.currentVersion === version.id;
};

const SecretValueDrawerPage = () => {
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');
  const { versionId } = useParams();
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();

  const [selectedVersion, setSelectedVersion] = useState<SecretVersion | undefined>(undefined);

  const isCurrentVersion = useIsCurrentVersion(selectedVersion);

  return (
    <Drawer
      data-testid={SECRET_VALUE_DRAWER_TEST_ID}
      heading={t('values')}
      onDismiss={() => {
        navigate('..');
      }}
      isOpen
    >
      <div className="flex flex-col gap-4">
        <VersionSelector
          okmsId={okmsId}
          secretPath={secretPath}
          versionId={versionId}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
        />
        {isCurrentVersion && <OdsMessage isDismissible={false}>{t('current_version')}</OdsMessage>}
        {selectedVersion && selectedVersion.state === 'ACTIVE' && (
          <SecretRawValue okmsId={okmsId} secretPath={secretPath} version={selectedVersion} />
        )}
      </div>
    </Drawer>
  );
};

export default SecretValueDrawerPage;
