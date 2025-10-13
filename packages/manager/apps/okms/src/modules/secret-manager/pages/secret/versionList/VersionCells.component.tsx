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

const versionCellIdDisabled: Record<SecretVersionState, boolean> = {
  ACTIVE: false,
  DEACTIVATED: true,
  DELETED: true,
};

export const VersionCellID = ({
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
      isDisabled={versionCellIdDisabled[version.state]}
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
    />
  );
};

export const VersionCellState = (version: SecretVersion) => (
  <VersionState state={version.state} />
);

export const VersionCellCreatedAt = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  return <DataGridTextCell>{formatDate(version.createdAt)}</DataGridTextCell>;
};

export const VersionCellDeactivatedAt = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  const date = version.deactivatedAt ? formatDate(version.deactivatedAt) : '-';

  return <DataGridTextCell>{date}</DataGridTextCell>;
};
