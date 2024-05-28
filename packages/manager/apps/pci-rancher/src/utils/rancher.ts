import { RancherService, RancherVersion } from '@/api/api.type';

export const isValidRancherName = (name: string) =>
  /^[a-z0-9][-_.A-Za-z0-9]{1,61}[a-z0-9]$/.test(name);

export const getVersion = (rancher?: RancherService) => {
  return rancher?.currentState.version;
};

export const getVersionInfoByName = (
  version: string,
  versions?: RancherVersion[],
) => versions?.find((v) => v.name === version);

export const getCurrentVersionInfo = (
  rancher: RancherService,
  versions?: RancherVersion[],
) => {
  const currentVersion = getVersion(rancher);
  return getVersionInfoByName(currentVersion, versions);
};

export const getLatestVersions = (
  rancher?: RancherService,
  versions?: RancherVersion[],
): RancherVersion[] | null => {
  const currentVersion = getVersion(rancher);

  if (versions === undefined || versions?.length === 0) {
    return null;
  }

  const sortedVersions = [...versions].sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });

  const latestVersionsAvailable = sortedVersions.filter(
    (version) => version.name > currentVersion,
  );

  return latestVersionsAvailable ?? null;
};

export const getLatestVersionAvailable = (
  rancher?: RancherService,
  versions?: RancherVersion[],
): RancherVersion | null =>
  getLatestVersions(rancher, versions)
    ?.filter((v) => v.status === 'AVAILABLE')
    ?.slice(-1)[0] ?? null;

export const isVersionDeprecated = (version: RancherVersion) => {
  return version.status === 'UNAVAILABLE' && version.cause === 'DEPRECATED';
};
