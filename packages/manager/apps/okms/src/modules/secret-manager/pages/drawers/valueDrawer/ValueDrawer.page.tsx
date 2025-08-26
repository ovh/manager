import React, { useState } from 'react';
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
import { useSecretVersions } from '@secret-manager/data/hooks/useSecretVersions';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useNavigate, useParams } from 'react-router-dom';
import { SecretDashboardPageParams } from '../../dashboard/dashboard.type';
import { SecretRawValue } from './SecretRawValue.component';
import { isErrorResponse } from '@/utils/api/api';

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

  const { data, isPending, isFetching, error } = useSecretVersions({
    domainId,
    path,
    pageSize: 100,
  });

  // isFetching forces to display the spinner when the version has changed
  // otherwise when the ods-select component is refreshed, react breaks
  if (isPending || isFetching)
    return (
      <div className="flex justify-center">
        <OdsSpinner data-testid={VERSION_SELECTOR_SPINNER_TEST_ID} />
      </div>
    );

  if (error) {
    const message = isErrorResponse(error)
      ? error.response.data.message
      : undefined;

    return (
      <OdsMessage
        className="mt-4"
        color="critical"
        data-testid={VERSION_SELECTOR_ERROR_TEST_ID}
      >
        {t('error_message', {
          message,
          ns: NAMESPACES.ERROR,
        })}
      </OdsMessage>
    );
  }

  const versions = data?.pages.flatMap((page) => page.data);

  if (!versions?.length) return null;

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
          defaultValue={versions[0].id.toString()}
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
