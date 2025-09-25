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
  Secret,
  SecretVersion,
  SecretVersionState,
} from '@secret-manager/types/secret.type';
import { VersionState } from '@secret-manager/components/VersionState/VersionState.component';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useFormatDate } from '@/common/hooks/useFormatDate';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { VERSION_LIST_CELL_TEST_IDS } from './VersionCells.constants';

const isVersionIdCellDisabled: Record<SecretVersionState, boolean> = {
  ACTIVE: false,
  DEACTIVATED: true,
  DELETED: true,
};

export const VersionIdCell = ({
  version,
  secret,
}: {
  version: SecretVersion;
  secret: Secret;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('secret-manager');
  const { okmsId, secretPath } = useParams<LocationPathParams>();

  const isCurrentVersion = version.id === secret?.metadata?.currentVersion;

  return (
    <div className="flex gap-2 items-center">
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
        urn={secret?.iam?.urn}
        iamActions={[
          kmsIamActions.secretGet,
          kmsIamActions.secretVersionGetData,
        ]}
        isDisplayTooltip
        data-testid={VERSION_LIST_CELL_TEST_IDS.version(version)}
      />
      {isCurrentVersion && (
        <OdsBadge
          data-testid={VERSION_LIST_CELL_TEST_IDS.currentVersionBadge}
          label={t('current_version')}
          color={'information'}
        />
      )}
    </div>
  );
};

export const VersionStateCell = (version: SecretVersion) => (
  <VersionState
    state={version.state}
    data-testid={VERSION_LIST_CELL_TEST_IDS.status(version)}
  />
);

export const VersionCreatedAtCell = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  return (
    <DataGridTextCell
      data-testid={VERSION_LIST_CELL_TEST_IDS.createdAt(version)}
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
      data-testid={VERSION_LIST_CELL_TEST_IDS.deactivatedAt(version)}
    >
      {date}
    </DataGridTextCell>
  );
};
