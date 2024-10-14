import { TOptions } from 'i18next';
import { RancherPlan, RancherService, RancherVersion } from '@/types/api.type';

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
 * @param {string} inputString - The input error message string.
 * @returns {null|{drivers: string[], plan: string}} - An object containing the drivers and plan, or null if extraction fails.
 * */
export function extractDriversAndPlanFromSwitchPlanError(
  inputString: string,
): null | { drivers: string[]; plan: string } {
  try {
    const openBracketIndex = inputString.indexOf('[');
    const closeBracketIndex = inputString.indexOf(']');
    const textBeforeBracket = inputString.substring(0, openBracketIndex).trim();
    const beginPhrase = 'Unable to switch to plan';
    if (textBeforeBracket.startsWith(beginPhrase)) {
      const [plan] =
        textBeforeBracket.match(/OVHCLOUD_EDITION/) ??
        textBeforeBracket.match(/STANDARD/);
      if (!plan) {
        return null;
      }
      const contentInsideBrackets = inputString
        .substring(openBracketIndex + 1, closeBracketIndex)
        .trim();
      if (contentInsideBrackets) {
        const drivers = contentInsideBrackets.split(',');

        // Create the final array with the text before the bracket and the elements inside the brackets
        if (drivers.length) {
          return { drivers, plan };
        }
      }

      return null;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Manages Rancher errors and returns appropriate error messages for internationalization.
 *
 * @param {Object} error - The error object containing the message and class.
 * @param {string} error.message - The error message.
 * @param {string} error.class - The error class.
 * @returns {[string, TOptions?]} - An array containing the error message key and optional options for internationalization.
 */
export const rancherErrorManagement = (error: {
  message: string;
  class: string;
}): [string, TOptions?] => {
  try {
    if (error.class === 'Server::InternalServerError') {
      return ['createRancherErrorInternalServerError'];
    }
    if (error.class === 'Client::BadRequest') {
      const content = extractDriversAndPlanFromSwitchPlanError(error.message);
      if (content) {
        const { plan, drivers } = content;
        return [
          'createRancherErrorInternalServerBadRequestChangePlan',
          { plan, drivers: `[${drivers}]` },
        ];
      }
      return [
        'createRancherError',
        { rancherCreationErrorMessage: error.message },
      ];
    }
    return [''];
  } catch (err) {
    return [''];
  }
};
