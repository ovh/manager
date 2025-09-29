/**
 * The CAS parameter is required on multiple cases:
 * - When the CAS is required by the secret
 * - When the CAS is required by the domain
 * - When we want to set the casRequired to true
 * We add the parameter only when it is required by the secret or the domain
 * because we want to avoid generating error messages by providing a value that is not needed
 */
export const addCurrentVersionToCas = (
  currentVersion: number,
  casRequired: boolean,
  isSettingCasRequired?: boolean,
) => {
  if (isSettingCasRequired || casRequired) {
    return currentVersion;
  }
  return undefined;
};
