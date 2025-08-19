import { TOptions } from 'i18next';
import semver from 'semver';
import {
  OVHError,
  RancherPlan,
  RancherService,
  RancherVersion,
} from '@/types/api.type';

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

export const sortVersions = (
  versions: RancherVersion[],
  order: 'asc' | 'desc' = 'asc',
): RancherVersion[] => {
  return versions.sort((a, b) => {
    return (order === 'asc' ? semver.compare : semver.rcompare)(a.name, b.name);
  });
};

export const getLatestVersions = (
  rancher?: RancherService,
  versions?: RancherVersion[],
): RancherVersion[] | null => {
  const currentVersion = getVersion(rancher);

  if (versions === undefined || versions?.length === 0) {
    return null;
  }

  const sortedVersions = sortVersions(versions);

  const filteredVersions = sortedVersions.filter((v) =>
    semver.lt(currentVersion, v.name),
  );

  return filteredVersions.length > 0 ? filteredVersions : null;
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

export const getRancherPlanDescription = (rancherPlan: RancherPlan['name']) => {
  switch (rancherPlan) {
    case 'STANDARD':
      return 'createRancherStandardPlanDescription';
    case 'OVHCLOUD_EDITION':
      return 'createRancherOVHCloudPlanDescription';
    default:
      return null;
  }
};

/**
 * Extracts drivers and plan information from a switch plan error message.
 *
 * @param inputString - The input error message string.
 * @returns - An object containing the drivers and plan, or null if extraction fails.
 * */
export function extractDriversAndPlanFromSwitchPlanError(
  inputString: string,
): null | { drivers: string[]; plan: string } {
  const beginPhrase = 'Unable to switch to plan';
  const planKeywords = ['OVHCLOUD_EDITION', 'STANDARD'];

  if (!inputString) {
    return null;
  }

  // Find the start and end of the bracket content
  const bracketStartIndex = inputString.indexOf('[');
  const bracketEndIndex = inputString.indexOf(']');

  if (
    bracketStartIndex === -1 ||
    bracketEndIndex === -1 ||
    bracketStartIndex >= bracketEndIndex
  ) {
    return null;
  }

  const contentInsideBrackets = inputString
    .substring(bracketStartIndex + 1, bracketEndIndex)
    .trim();
  const textBeforeBracket = inputString.substring(0, bracketStartIndex).trim();

  if (!textBeforeBracket.startsWith(beginPhrase)) {
    return null;
  }

  const plan = planKeywords.find((keyword) =>
    textBeforeBracket.includes(keyword),
  );

  if (!plan) {
    return null;
  }

  if (contentInsideBrackets) {
    const drivers = contentInsideBrackets
      .split(',')
      .map((driver) => driver.trim());
    if (drivers.length) {
      return { drivers, plan };
    }
  }

  return null;
}

/**
 * Type guard to check if the error is an OVHError.
 *
 * @param error - The error object to check.
 * @returns - True if the error is an OVHError, false otherwise.
 */
function isOVHError(error: unknown): error is OVHError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'class' in error &&
    typeof (error as OVHError).class === 'string' &&
    'message' in error &&
    typeof (error as OVHError).message === 'string'
  );
}

/**
 * Manages Rancher driver error and return appropriate error messages for internationalization.
 *
 * @param error - The error object containing the message and class.
 * @returns - An array containing the error message key and optional options for internationalization, or null if the error is not recognized.
 */
export const getI18nextDriverError = (
  error: string,
): [string, TOptions] | null => {
  const content = extractDriversAndPlanFromSwitchPlanError(error);
  if (content) {
    const { plan, drivers } = content;
    return ['badRequestSwitchPlan', { plan, drivers: `[${drivers}]` }];
  }
  return null;
};
