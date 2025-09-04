import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@ovh-ux/manager-react-components';
import { VALUE_DRAWER_TEST_ID } from '@secret-manager/utils/tests/secretValue.constants';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { useNavigate, useParams } from 'react-router-dom';
import { SecretRawValue } from './SecretRawValue.component';
import { VersionSelector } from './VersionSelector.component';

const ValueDrawerPage = () => {
  const { domainId, secretPath, versionId } = useParams<LocationPathParams>();
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();

  const [currentVersion, setCurrentVersion] = useState<
    SecretVersion | undefined
  >(undefined);

  return (
    <Drawer
      data-testid={VALUE_DRAWER_TEST_ID}
      heading={t('values')}
      onDismiss={() => {
        navigate('..');
      }}
      isOpen
    >
      <div className="flex flex-col gap-4">
        <VersionSelector
          domainId={domainId}
          secretPath={secretPath}
          versionId={versionId}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
        />
        {currentVersion && currentVersion.state === 'ACTIVE' && (
          <SecretRawValue
            domainId={domainId}
            secretPath={secretPath}
            version={currentVersion}
          />
        )}
      </div>
    </Drawer>
  );
};

export default ValueDrawerPage;
