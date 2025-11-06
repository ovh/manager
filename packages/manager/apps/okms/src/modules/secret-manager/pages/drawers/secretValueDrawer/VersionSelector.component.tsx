import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsMessage,
  OdsSelect,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { VersionState } from '@secret-manager/components/VersionState/VersionState.component';
import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import {
  VERSION_SELECTOR_ERROR_TEST_ID,
  VERSION_SELECTOR_SELECT_SKELETON_TEST_ID,
  VERSION_SELECTOR_STATUS_SKELETON_TEST_ID,
  VERSION_SELECTOR_TEST_ID,
} from './VersionSelector.constants';
import { isErrorResponse } from '@/utils/api/api';

type VersionSelectorParams = {
  okmsId: string;
  secretPath: string;
  versionId: string;
  selectedVersion: SecretVersion;
  setSelectedVersion: React.Dispatch<React.SetStateAction<SecretVersion>>;
};

export const VersionSelector = ({
  okmsId,
  secretPath,
  versionId,
  selectedVersion,
  setSelectedVersion,
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

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex gap-2 items-center h-8">
        <OdsText preset="span" className="w-1/3">
          {t('version')}
        </OdsText>
        {/*   isFetching forces to display the spinner when the version has changed
        otherwise when the ods-select component is refreshed, react breaks */}
        {isPending || isFetching ? (
          <OdsSkeleton
            className="flex-grow"
            data-testid={VERSION_SELECTOR_SELECT_SKELETON_TEST_ID}
          />
        ) : (
          <OdsSelect
            data-testid={VERSION_SELECTOR_TEST_ID}
            className="flex-grow"
            name="version-selector"
            onOdsChange={(value) =>
              setSelectedVersion(
                versions.find((v) => v.id === Number(value.detail.value)),
              )
            }
            defaultValue={
              versionId
                ? versions
                    .find((version) => version.id.toString() === versionId)
                    .id.toString()
                : versions[0].id.toString()
            }
            isDisabled={versions.length === 1}
          >
            {versions.map((version) => (
              <option value={version.id} key={version.id}>
                {version.id}
              </option>
            ))}
          </OdsSelect>
        )}
      </div>
      <div className="flex gap-2 items-center h-8">
        <OdsText preset="span" className="w-1/3">
          {t('status', { ns: NAMESPACES.STATUS })}
        </OdsText>
        {isPending ? (
          <OdsSkeleton
            className="flex-grow"
            data-testid={VERSION_SELECTOR_STATUS_SKELETON_TEST_ID}
          />
        ) : (
          selectedVersion && <VersionState state={selectedVersion.state} />
        )}
      </div>
    </div>
  );
};
