import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/manager-react-components';
import {
  OdsMessage,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  VALUE_DRAWER_TEST_ID,
  VERSION_SELECTOR_ERROR_TEST_ID,
  VERSION_SELECTOR_SPINNER_TEST_ID,
  VERSION_SELECTOR_TEST_ID,
} from '@secret-manager/utils/tests/secretValue.constants';
import { VersionState } from '@secret-manager/components/VersionState/VersionState.component';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useSecretVersions } from '@secret-manager/data/hooks/useSecretVersions';
import { useNavigate, useParams } from 'react-router-dom';
import { SecretDashboardPageParams } from '../../dashboard/dashboard.type';
import { SecretRawValue } from './SecretRawValue.component';

type VersionSelectorParams = {
  domainId: string;
  path: string;
  currentVersion: SecretVersion;
  setCurrentVersion: React.Dispatch<React.SetStateAction<SecretVersion>>;
};

const VersionSelector = ({
  domainId,
  path,
  currentVersion,
  setCurrentVersion,
}: VersionSelectorParams) => {
  const { t } = useTranslation([
    'secret-manager/common',
    NAMESPACES.STATUS,
    NAMESPACES.ERROR,
  ]);
  const { data: versions, isPending, isFetching, error } = useSecretVersions(
    domainId,
    path,
  );

  if (isPending || isFetching)
    // isFetching forces to display the spinner when the version has changed
    // otherwise when the ods-select component is refreshed, react breaks
    return (
      <div className="flex justify-center">
        <OdsSpinner data-testid={VERSION_SELECTOR_SPINNER_TEST_ID} />
      </div>
    );

  if (error)
    return (
      <OdsMessage
        className="mt-4"
        color="critical"
        data-testid={VERSION_SELECTOR_ERROR_TEST_ID}
      >
        {t('error_message', { message: error.message, ns: NAMESPACES.ERROR })}
      </OdsMessage>
    );

  const defaultSelectedVersion = versions[0];

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex gap-2 items-center">
        <OdsText preset="span" className="w-1/3">
          {t('version')}
        </OdsText>
        <OdsSelect
          data-testid={VERSION_SELECTOR_TEST_ID}
          className="flex-grow"
          name="version-selector"
          onOdsChange={(value) =>
            setCurrentVersion(
              versions.find((v) => v.id === Number(value.detail.value)),
            )
          }
          defaultValue={defaultSelectedVersion.id.toString()}
          isDisabled={versions.length === 1}
        >
          {versions.map((version) => (
            <option value={version.id} key={version.id}>
              {version.id}
            </option>
          ))}
        </OdsSelect>
      </div>
      {currentVersion && (
        <div className="flex gap-2 items-center">
          <OdsText preset="span" className="w-1/3">
            {t('status', { ns: NAMESPACES.STATUS })}
          </OdsText>
          <VersionState state={currentVersion.state} />
        </div>
      )}
    </div>
  );
};

const ValueDrawerPage = () => {
  const { t } = useTranslation('secret-manager/common');
  const navigate = useNavigate();

  const { domainId, secretPath } = useParams<SecretDashboardPageParams>();
  const secretPathDecoded = decodeSecretPath(secretPath);

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
          path={secretPathDecoded}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
        />
        {currentVersion && currentVersion.state === 'ACTIVE' && (
          <SecretRawValue
            domainId={domainId}
            path={secretPathDecoded}
            version={currentVersion}
          />
        )}
      </div>
    </Drawer>
  );
};

export default ValueDrawerPage;
