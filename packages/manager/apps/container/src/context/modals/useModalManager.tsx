import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useAuthorizationIam,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';
import { useApplication } from '@/context';
import { useAccountUrn } from '@/hooks/accountUrn/useAccountUrn';
import {
  useCreatePreference,
  usePreferences,
} from '@/hooks/preferences/usePreferences';
import { useTime } from '@/hooks/time/useTime';

type ModalFullContext = {
  isDisplayed?: boolean;
  data?: unknown;
};

export const useModalManager = (
  configuration: ModalToDisplayConfiguration | null,
): ModalFullContext => {
  const { shell } = useApplication();
  const navigation = shell.getPlugin('navigation');
  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();
  const [isDisplayed, setIsDisplayed] = useState(undefined);

  /*
   * Synchronous checks
   */
  const isUserMatchingCriterion = configuration?.checks.userCheck
    ? configuration.checks.userCheck(user)
    : true;

  const isOnExcludedPage = configuration?.checks.excludedUrls
    ? configuration.checks.excludedUrls.some((buildUrlParams) => {
        const appName =
          typeof buildUrlParams.appName === 'function'
            ? buildUrlParams.appName(environment)
            : buildUrlParams.appName;
        const appPath =
          typeof buildUrlParams.appPath === 'function'
            ? buildUrlParams.appPath(environment)
            : buildUrlParams.appPath;
        const url = navigation.getURL(appName, appPath);
        return window.location.href === url;
      })
    : false;

  const isOnIncludedPage = configuration?.checks.includedUrls
    ? configuration.checks.includedUrls.some((buildUrlParams) => {
        const appName =
          typeof buildUrlParams.appName === 'function'
            ? buildUrlParams.appName(environment)
            : buildUrlParams.appName;
        const appPath =
          typeof buildUrlParams.appPath === 'function'
            ? buildUrlParams.appPath(environment)
            : buildUrlParams.appPath;
        const url = navigation.getURL(appName, appPath);
        return window.location.href === url;
      })
    : true;

  /*
   * Asynchronous checks (triggered after synchronous check are done)
   */
  const isUseFeatureAvailabilityEnabled =
    Boolean(configuration?.checks.featuresAvailability) &&
    isUserMatchingCriterion === true &&
    isOnExcludedPage === false &&
    isOnIncludedPage === true;
  const { data: availability } = useFeatureAvailability(
    configuration?.checks.featuresAvailability || [],
    {
      enabled: isUseFeatureAvailabilityEnabled,
    },
  );
  const isFeatureAvailable = useMemo(() => {
    if (!configuration?.checks.featuresAvailability) return true;

    if (!availability) return undefined;

    return (configuration?.checks.featuresAvailability || []).every(
      (feature) => availability[feature],
    );
  }, [configuration?.checks.featuresAvailability, availability]);

  const isUseAccountUrnEnabled =
    Boolean(configuration?.checks.iamRights) &&
    (!configuration?.checks.featuresAvailability ||
      Boolean(isFeatureAvailable));
  const { data: urn } = useAccountUrn({
    enabled: isUseAccountUrnEnabled,
  });
  const { isAuthorized, data: authorizations } = useAuthorizationIam(
    configuration?.checks.iamRights || [],
    urn,
  );

  const preferencesKey = useMemo(
    () =>
      `LAST_${configuration?.component.name
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toUpperCase()}_DISPLAY_TIME`,
    [configuration],
  );
  const isUsePreferencesEnabled =
    Boolean(configuration?.checks.intervalInSeconds) &&
    (!configuration?.checks.featuresAvailability ||
      Boolean(isFeatureAvailable)) &&
    (!configuration?.checks.iamRights || isAuthorized);
  const { data: preference, isError } = usePreferences(preferencesKey, {
    enabled: isUsePreferencesEnabled,
  });
  const { data: time } = useTime({
    enabled: isError || preference !== undefined,
  });
  const isTimeToShowModal = useMemo(() => {
    if (!configuration?.checks.intervalInSeconds || isError) return true;

    if (preference === undefined || time === undefined) return undefined;

    return (
      !preference ||
      time - Number(preference) >= configuration?.checks.intervalInSeconds
    );
  }, [configuration?.checks.intervalInSeconds, preference, time]);

  const isUseQueryEnabled =
    Boolean(configuration?.data?.queryParams) &&
    (!configuration?.checks.featuresAvailability ||
      Boolean(isFeatureAvailable)) &&
    (!configuration?.checks.iamRights || isAuthorized) &&
    (!configuration?.checks.intervalInSeconds || Boolean(isTimeToShowModal));
  const { data } = useQuery({
    ...(configuration?.data?.queryParams || {
      queryKey: [''],
      queryFn: () => null,
    }),
    enabled: isUseQueryEnabled,
  });
  const isDataMatchingCriterion = useMemo(() => {
    // If the modal does not require data fetching, we allow the display
    if (!configuration?.data) return true;

    if (data === undefined) return undefined;

    return configuration?.data?.check ? configuration.data.check(data) : true;
  }, [configuration, data]);

  const { mutate: updatePreference } = useCreatePreference(
    preferencesKey,
    time,
    false,
  );

  useEffect(() => {
    if (
      !!configuration &&
      (isUserMatchingCriterion === false ||
        isOnExcludedPage === true ||
        isOnIncludedPage === false ||
        isFeatureAvailable === false ||
        (urn && authorizations && isAuthorized === false) ||
        isTimeToShowModal === false ||
        isDataMatchingCriterion === false)
    ) {
      setIsDisplayed(false);
    } else if (
      !!configuration &&
      isUserMatchingCriterion &&
      !isOnExcludedPage &&
      isOnIncludedPage &&
      isFeatureAvailable &&
      (!configuration?.checks.iamRights || isAuthorized) &&
      isTimeToShowModal &&
      isDataMatchingCriterion
    ) {
      setIsDisplayed(true);
      updatePreference();
    } else {
      setIsDisplayed(undefined);
    }
  }, [
    isUserMatchingCriterion,
    isOnExcludedPage,
    isOnIncludedPage,
    availability,
    isAuthorized,
    isTimeToShowModal,
    isDataMatchingCriterion,
  ]);

  return {
    isDisplayed,
    data,
  };
};
