import { SecretVersion } from '@secret-manager/types/secret.type';

export const VERSION_LIST_CELL_TEST_IDS = {
  version: (version: SecretVersion) =>
    `version-list-cell-v${version.id}-version`,
  currentVersionBadge: 'current-version-badge',
  status: (version: SecretVersion) => `version-list-cell-v${version.id}-status`,
  createdAt: (version: SecretVersion) =>
    `version-list-cell-v${version.id}-created-at`,
  deactivatedAt: (version: SecretVersion) =>
    `version-list-cell-v${version.id}-deactivated-at`,
};
