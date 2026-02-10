import { VersionState } from '@secret-manager/components/version-state-badge/VersionStateBadge.component';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret, SecretVersion, SecretVersionState } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Badge, Text } from '@ovhcloud/ods-react';

import { InternalLink } from '@/common/components/link/Link.component';
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
  const href = SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
    okmsId,
    secretPath,
    version.id,
  );
  const isCurrentVersion = version.id === secret?.metadata?.currentVersion;

  return (
    <div className="flex items-center gap-2">
      <InternalLink
        to={href}
        disabled={isVersionIdCellDisabled[version.state]}
        urn={secret?.iam?.urn}
        iamActions={[kmsIamActions.secretGet, kmsIamActions.secretVersionGetData]}
        displayTooltip
        data-testid={VERSION_LIST_CELL_TEST_IDS.version(version)}
      >
        {version.id.toString()}
      </InternalLink>
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
    <Text preset="span" data-testid={VERSION_LIST_CELL_TEST_IDS.createdAt(version)}>
      {formatDate(version.createdAt)}
    </Text>
  );
};

export const VersionDeactivatedAtCell = (version: SecretVersion) => {
  const { formatDate } = useFormatDate();

  const date = version.deactivatedAt ? formatDate(version.deactivatedAt) : '-';

  return (
    <Text preset="span" data-testid={VERSION_LIST_CELL_TEST_IDS.deactivatedAt(version)}>
      {date}
    </Text>
  );
};
