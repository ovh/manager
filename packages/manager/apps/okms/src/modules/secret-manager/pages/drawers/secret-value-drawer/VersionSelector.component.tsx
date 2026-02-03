import React, { useEffect } from 'react';

import { VersionState } from '@secret-manager/components/version-state-badge/VersionStateBadge.component';
import { useSecretVersionList } from '@secret-manager/data/hooks/useSecretVersionList';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { Message, Select, SelectContent, SelectControl, Skeleton, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { isErrorResponse } from '@/common/utils/api/api';

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
      <Message className="mt-4" color="critical" data-testid={VERSION_SELECTOR_ERROR_TEST_ID}>
        {t('error_message', {
          message,
          ns: NAMESPACES.ERROR,
        })}
      </Message>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex h-8 items-center gap-2">
        <Text preset="span" className="w-1/3">
          {t('version')}
        </Text>
        {/*   isFetching forces to display the spinner when the version has changed
        otherwise when the ods-select component is refreshed, react breaks */}
        {isPending || isFetching ? (
          <Skeleton className="grow" data-testid={VERSION_SELECTOR_SELECT_SKELETON_TEST_ID} />
        ) : (
          <VersionSelectorSelect
            defaultVersionId={defaultVersionId}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            versions={data?.pages.flatMap((page) => page.data)}
          />
        )}
      </div>
      <div className="flex h-8 items-center gap-2">
        <Text preset="span" className="w-1/3">
          {t('status', { ns: NAMESPACES.STATUS })}
        </Text>
        {isPending ? (
          <Skeleton className="grow" data-testid={VERSION_SELECTOR_STATUS_SKELETON_TEST_ID} />
        ) : (
          selectedVersion && <VersionState state={selectedVersion.state} />
        )}
      </div>
    </div>
  );
};

type VersionSelectorSelectProps = Pick<
  VersionSelectorParams,
  'defaultVersionId' | 'selectedVersion' | 'setSelectedVersion'
> & {
  versions: SecretVersion[];
};

const VersionSelectorSelect = ({
  defaultVersionId,
  selectedVersion,
  setSelectedVersion,
  versions,
}: VersionSelectorSelectProps) => {
  const items = versions.map((version) => ({
    value: version.id.toString(),
    label: version.id.toString(),
  }));

  // Initialize the selected version if a default version is provided, otherwise use the first version
  useEffect(() => {
    if (defaultVersionId) {
      const version = versions.find((version) => version.id.toString() === defaultVersionId);
      setSelectedVersion(version);
    } else {
      setSelectedVersion(versions[0]);
    }
  }, [defaultVersionId, versions, setSelectedVersion]);

  const handleOnValueChange = (detail: { value: string[] }) => {
    const selectedValue = detail.value[0];
    const version = versions.find((v) => v.id.toString() === selectedValue);
    setSelectedVersion(version);
  };

  return (
    <Select
      data-testid={VERSION_SELECTOR_TEST_ID}
      className="grow"
      name="version-selector"
      onValueChange={handleOnValueChange}
      value={selectedVersion ? [selectedVersion.id.toString()] : undefined}
      disabled={versions.length === 1}
      items={items}
    >
      <SelectControl />
      <SelectContent createPortal={false} />
    </Select>
  );
};
