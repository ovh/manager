import { SecretVersion } from '@secret-manager/types/secret.type';

export const versionListCellTestId = (
  version: SecretVersion,
  suffix: string,
) => {
  return `version-list-cell-v${version.id}-${suffix}`;
};
