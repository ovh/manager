import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsMessage,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  VERSION_SELECTOR_ERROR_TEST_ID,
  VERSION_SELECTOR_SPINNER_TEST_ID,
  VERSION_SELECTOR_TEST_ID,
} from '@secret-manager/utils/tests/secretValue.constants';
import { VersionState } from '@secret-manager/components/VersionState/VersionState.component';
import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { isErrorResponse } from '@/utils/api/api';

type VersionSelectorParams = {
  okmsId: string;
  secretPath: string;
  versionId: string;
  currentVersion: SecretVersion;
  setCurrentVersion: React.Dispatch<React.SetStateAction<SecretVersion>>;
};

export const VersionSelector = ({
  okmsId,
  secretPath,
  versionId,
  currentVersion,
  setCurrentVersion,
}: VersionSelectorParams) => {
  const secretPathDecoded = decodeSecretPath(secretPath);

  const { t } = useTranslation([
    'secret-manager',
    NAMESPACES.STATUS,
    NAMESPACES.ERROR,
  ]);

  const { data, isPending, isFetching, error } = useSecretVersionList({
    okmsId,
    path: secretPathDecoded,
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

  const defaultVersion = versionId
    ? versions
        .find((version) => version.id.toString() === versionId)
        .id.toString()
    : versions[0].id.toString();

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
          defaultValue={defaultVersion}
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
