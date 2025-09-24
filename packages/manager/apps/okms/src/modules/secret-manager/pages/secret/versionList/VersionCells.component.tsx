import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import {
  DataGridTextCell,
  ManagerLink,
} from '@ovh-ux/manager-react-components';
import {
  SecretVersion,
  SecretVersionState,
} from '@secret-manager/types/secret.type';
import { VersionState } from '@secret-manager/components/VersionState/VersionState.component';
import { useFormatDate } from '@/common/hooks/useFormatDate';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { versionListCellTestId } from './VersionCells.constants';

const isVersionIdCellDisabled: Record<SecretVersionState, boolean> = {
  ACTIVE: false,
  DEACTIVATED: true,
  DELETED: true,
};

export const VersionIdCell = ({
  version,
  urn,
}: {
  version: SecretVersion;
  urn: string;
}) => {
  const navigate = useNavigate();
  const { okmsId, secretPath } = useParams<LocationPathParams>();

  return (
    <ManagerLink
      label={version.id.toString()}
      href={null}
      isDisabled={isVersionIdCellDisabled[version.state]}
      onClick={() => {
        navigate(
          SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
            okmsId,
            secretPath,
            version.id,
          ),
        );
      }}
      urn={urn}
      iamActions={[kmsIamActions.secretGet, kmsIamActions.secretVersionGetData]}
      isDisplayTooltip
      data-testid={versionListCellTestId(version, 'version')}
    />
  );
};

export const VersionStateCell = (version: SecretVersion) => (
  <VersionState
    state={version.state}
    data-testid={versionListCellTestId(version, 'status')}
  />
);

export const VersionCreatedAtCell = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  return (
    <DataGridTextCell
      data-testid={versionListCellTestId(version, 'created-at')}
    >
      {formatDate(version.createdAt)}
    </DataGridTextCell>
  );
};

export const VersionDeactivatedAtCell = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  const date = version.deactivatedAt ? formatDate(version.deactivatedAt) : '-';

  return (
    <DataGridTextCell
      data-testid={versionListCellTestId(version, 'deactivated-at')}
    >
      {date}
    </DataGridTextCell>
  );
};
