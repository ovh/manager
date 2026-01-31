import { useHref } from 'react-router-dom';

import { VersionState } from '@secret-manager/components/version-state-badge/VersionStateBadge.component';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret, SecretVersion, SecretVersionState } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Badge } from '@ovhcloud/ods-react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { MukLink } from '@/common/components/link/Link.component';
import { useFormatDate } from '@/common/hooks/useFormatDate';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { VERSION_LIST_CELL_TEST_IDS } from './VersionCells.constants';

const isVersionIdCellDisabled: Record<SecretVersionState, boolean> = {
  ACTIVE: false,
  DEACTIVATED: true,
  DELETED: true,
};

export const VersionIdCell = ({ version, secret }: { version: SecretVersion; secret: Secret }) => {
  const { t } = useTranslation('secret-manager');
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');
  const href = useHref(
    SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(okmsId, secretPath, version.id),
  );

  const isCurrentVersion = version.id === secret?.metadata?.currentVersion;

  return (
    <div className="flex items-center gap-2">
      <MukLink
        href={href}
        disabled={isVersionIdCellDisabled[version.state]}
        urn={secret?.iam?.urn}
        iamActions={[kmsIamActions.secretGet, kmsIamActions.secretVersionGetData]}
        displayTooltip
        data-testid={VERSION_LIST_CELL_TEST_IDS.version(version)}
      >
        {version.id.toString()}
      </MukLink>
      {isCurrentVersion && (
        <Badge data-testid={VERSION_LIST_CELL_TEST_IDS.currentVersionBadge} color="information">
          {t('current_version')}
        </Badge>
      )}
    </div>
  );
};

export const VersionStateCell = (version: SecretVersion) => (
  <VersionState state={version.state} data-testid={VERSION_LIST_CELL_TEST_IDS.status(version)} />
);

export const VersionCreatedAtCell = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  return (
    <DataGridTextCell data-testid={VERSION_LIST_CELL_TEST_IDS.createdAt(version)}>
      {formatDate(version.createdAt)}
    </DataGridTextCell>
  );
};

export const VersionDeactivatedAtCell = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  const date = version.deactivatedAt ? formatDate(version.deactivatedAt) : '-';

  return (
    <DataGridTextCell data-testid={VERSION_LIST_CELL_TEST_IDS.deactivatedAt(version)}>
      {date}
    </DataGridTextCell>
  );
};
