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
import { versionLinkTestId } from './VersionCells.constants';

const versionCellIdDisabled: Record<SecretVersionState, boolean> = {
  ACTIVE: false,
  DEACTIVATED: true,
  DELETED: true,
};

export const VersionCellID = ({
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
        data-testid={versionLinkTestId(version.id)}
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
        urn={secret?.iam?.urn}
        iamActions={[
          kmsIamActions.secretGet,
          kmsIamActions.secretVersionGetData,
        ]}
        isDisplayTooltip
      />
      {isCurrentVersion && (
        <OdsBadge label={t('current_version')} color={'information'} />
      )}
    </div>
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
