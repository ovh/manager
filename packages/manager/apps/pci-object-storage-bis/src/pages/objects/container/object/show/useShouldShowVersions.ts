import { STATUS_DISABLED } from '@/constants';

export const shouldShowVersions = ({
  isLatest,
  isLocalZone,
  shouldSeeVersions,
  enableVersionsToggle,
  versioningStatus,
}: {
  isLatest: boolean | undefined;
  isLocalZone: boolean;
  shouldSeeVersions?: boolean;
  enableVersionsToggle?: boolean;
  versioningStatus?: string;
}): boolean => {
  return enableVersionsToggle
    ? Boolean(isLatest && shouldSeeVersions)
    : isLatest !== false &&
        !isLocalZone &&
        Boolean(shouldSeeVersions) &&
        versioningStatus !== STATUS_DISABLED;
};
