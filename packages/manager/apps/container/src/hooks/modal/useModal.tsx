import { UseQueryResult } from "@tanstack/react-query";
import { User } from "@ovh-ux/manager-config";
import { useAuthorizationIam, useFeatureAvailability } from "@ovh-ux/manager-react-components";
import { useApplication } from '@/context';
import { useAccountUrn } from "@/hooks/accountUrn/useAccountUrn";
import { usePreferences } from "@/hooks/preferences/usePreferences";
import { useTime } from "@/hooks/time/useTime";

export const useCheckModalDisplaySynchronous = (
  userCheck?: (user: User) => boolean,
  excludedUrls?: string[],
  includedUrls?: string[],
) => {
  const { shell } = useApplication();
  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();

  if (userCheck && !userCheck(user)) {
    return false;
  }

  if (excludedUrls?.length && excludedUrls.indexOf(window.location.href) !== -1) {
    return false;
  }

  if (includedUrls?.length && includedUrls.indexOf(window.location.href) === -1) {
    return false;
  }

  return true;
};

export const useCheckModalDisplay = (
  userCheck?: (user: User) => boolean,
  excludedUrls?: string[],
  includedUrls?: string[],
  features?: string[],
  iamActions?: string[],
  modalPreferenceKey?: string,
  intervalInSeconds?: number,
  queryExecutor?: (enabled: boolean) => UseQueryResult,
  dataCheck?: (data: any) => boolean,
) => {
  const isCheckOk = useCheckModalDisplaySynchronous(userCheck, excludedUrls, includedUrls);

  // Feature availability check
  // If synchronous checks are not OK, or there is no features to be checked, we skip the check
  const hasFeaturesToCheck = features?.length > 0;
  const isUseFeatureAvailabilityEnabled = isCheckOk && hasFeaturesToCheck;
  const { data: availabilities, isFetched: isFeatureAvailabilityFetched } = useFeatureAvailability(
    features || [],
    {
      enabled: Boolean(isUseFeatureAvailabilityEnabled),
    },
  );

  const isFeatureAvailable = !hasFeaturesToCheck || (isFeatureAvailabilityFetched && features.every(
    (feature) => availabilities[feature],
  ));

  // IAM rights check
  // If synchronous checks are not OK, features are not available, or there is no rights to check, we skip the check
  const hasIamRightsToCheck = iamActions?.length > 0;
  const isUseAccountUrnEnabled = isCheckOk && isFeatureAvailable && hasIamRightsToCheck;
  const { data: urn } = useAccountUrn({
    enabled: Boolean(isUseAccountUrnEnabled),
  });
  const { isAuthorized, isFetched: isAuthorizationFetched } = useAuthorizationIam(
    iamActions || [],
    urn,
  );

  const isAccountAuthorized = !hasIamRightsToCheck || (isAuthorizationFetched && isAuthorized);

  // Interval between display check
  // If synchronous checks are not OK, features are not available, user is not authorized, or there is no interval to check, we skip the check
  const hasIntervalToCheck = modalPreferenceKey !== undefined && intervalInSeconds !== undefined;
  const isUsePreferencesEnabled = isCheckOk && isFeatureAvailable && isAccountAuthorized && hasIntervalToCheck;
  const { data: preference } = usePreferences(modalPreferenceKey, {
    enabled: Boolean(isUsePreferencesEnabled),
  });
  const { data: time, isFetched: isTimeFetched } = useTime({
    enabled: preference !== undefined,
  });

  const isTimeToShowModal = !hasIntervalToCheck || preference === null || (preference !== undefined && isTimeFetched && time - Number(preference) >= intervalInSeconds);

  // Data check
  // If synchronous checks are not OK, features are not available, user is not authorized, not enough time elapsed since the last display, or there is no data to check, we skip the check
  const hasDataToCheck = queryExecutor !== undefined;
  const isQueryExecutorEnabled = isCheckOk && isFeatureAvailable && isAccountAuthorized && isTimeToShowModal && hasDataToCheck;
  const { data, isFetched } = queryExecutor !== undefined
    ? queryExecutor(Boolean(isQueryExecutorEnabled))
    : { data: undefined, isFetched: true };
  
  const isDataCheckOk = !hasDataToCheck || !dataCheck || (isFetched && dataCheck(data));

  if (!isCheckOk) {
    return false;
  }

  // If we haven't fetch all required data, we don't indicate to caller if they should either show or hide the modal
  if (
    (hasFeaturesToCheck && isUseFeatureAvailabilityEnabled && !isFeatureAvailabilityFetched) ||
    (hasIamRightsToCheck && isUseAccountUrnEnabled && !(urn && isAuthorizationFetched)) ||
    (hasIntervalToCheck && isUsePreferencesEnabled && !(preference !== undefined && isTimeFetched)) ||
    (hasDataToCheck && isQueryExecutorEnabled && !isFetched)
  ) {
    return undefined;
  }

  return isFeatureAvailable &&
    isAccountAuthorized &&
    isTimeToShowModal &&
    isDataCheckOk;
};