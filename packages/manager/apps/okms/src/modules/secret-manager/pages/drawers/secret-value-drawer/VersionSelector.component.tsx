import React from 'react';

import { VersionState } from '@secret-manager/components/version-state/VersionState.component';
import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { OdsSelectChangeEventDetail, OdsSelectCustomEvent } from '@ovhcloud/ods-components';
import { OdsMessage, OdsSelect, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { isErrorResponse } from '@/common/utils/api/api';
import { odsSelectValueToValue, valueToOdsSelectValue } from '@/common/utils/ods/odsSelect';

import {
  VERSION_SELECTOR_ERROR_TEST_ID,
  VERSION_SELECTOR_SELECT_SKELETON_TEST_ID,
  VERSION_SELECTOR_STATUS_SKELETON_TEST_ID,
  VERSION_SELECTOR_TEST_ID,
} from './VersionSelector.constants';

type VersionSelectorParams = {
  okmsId: string;
  secretPath: string;
  defaultVersionId: string | undefined;
  selectedVersion: SecretVersion | undefined;
  setSelectedVersion: React.Dispatch<React.SetStateAction<SecretVersion | undefined>>;
};

export const VersionSelector = ({
  okmsId,
  secretPath,
  defaultVersionId,
  selectedVersion,
  setSelectedVersion,
}: VersionSelectorParams) => {
  const secretPathDecoded = decodeSecretPath(secretPath);

  const { t } = useTranslation(['secret-manager', NAMESPACES.STATUS, NAMESPACES.ERROR]);

  const { data, isPending, isFetching, error } = useSecretVersionList({
    okmsId,
    path: secretPathDecoded,
    pageSize: 100,
  });

  if (error) {
    const message = isErrorResponse(error) ? error.response.data.message : undefined;

    return (
      <OdsMessage className="mt-4" color="critical" data-testid={VERSION_SELECTOR_ERROR_TEST_ID}>
        {t('error_message', {
          message,
          ns: NAMESPACES.ERROR,
        })}
      </OdsMessage>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex h-8 items-center gap-2">
        <OdsText preset="span" className="w-1/3">
          {t('version')}
        </OdsText>
        {/*   isFetching forces to display the spinner when the version has changed
        otherwise when the ods-select component is refreshed, react breaks */}
        {isPending || isFetching ? (
          <OdsSkeleton className="grow" data-testid={VERSION_SELECTOR_SELECT_SKELETON_TEST_ID} />
        ) : (
          <VersionSelectorSelect
            defaultVersionId={defaultVersionId}
            setSelectedVersion={setSelectedVersion}
            versions={data?.pages.flatMap((page) => page.data)}
          />
        )}
      </div>
      <div className="flex h-8 items-center gap-2">
        <OdsText preset="span" className="w-1/3">
          {t('status', { ns: NAMESPACES.STATUS })}
        </OdsText>
        {isPending ? (
          <OdsSkeleton className="grow" data-testid={VERSION_SELECTOR_STATUS_SKELETON_TEST_ID} />
        ) : (
          selectedVersion && <VersionState state={selectedVersion.state} />
        )}
      </div>
    </div>
  );
};

type VersionSelectorSelectProps = Pick<
  VersionSelectorParams,
  'defaultVersionId' | 'setSelectedVersion'
> & {
  versions: SecretVersion[];
};

const VersionSelectorSelect = ({
  defaultVersionId,
  setSelectedVersion,
  versions,
}: VersionSelectorSelectProps) => {
  // Default to the first version if no default version is provided
  let defaultVersion: SecretVersion | undefined = versions[0];

  // If a default version is provided, use it
  if (defaultVersionId) {
    defaultVersion = versions.find((version) => version.id.toString() === defaultVersionId);
  }

  const handleOnSelect = (value: OdsSelectCustomEvent<OdsSelectChangeEventDetail>) => {
    const version = versions.find((v) => v.id === odsSelectValueToValue(value.detail.value ?? ''));
    setSelectedVersion(version);
  };

  return (
    <OdsSelect
      data-testid={VERSION_SELECTOR_TEST_ID}
      className="grow"
      name="version-selector"
      onOdsChange={handleOnSelect}
      defaultValue={defaultVersion ? valueToOdsSelectValue(defaultVersion.id) : undefined}
      isDisabled={versions.length === 1}
    >
      {versions.map((version) => (
        <option value={valueToOdsSelectValue(version.id)} key={version.id}>
          {version.id}
        </option>
      ))}
    </OdsSelect>
  );
};
