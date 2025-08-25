import { useLayoutEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createError, createSuccess, isSuccess } from '../types/Result';
import { getSafeDefaultFeature } from '../utils/ObsFeaturesUtils';
import {
  FeatureSwitcherItem,
  ObsFeatureResult,
  ObsFeatureType,
} from '../types';

interface UseObservabilityFeaturesResult {
  currentObsFeature: ObsFeatureType | null;
  currentObsFeatureResult: ObsFeatureResult;
  availableFeatures: ObsFeatureType[];
  hasValidFeature: boolean;
  shouldShowFeatureSwitcher: boolean;
  featureSwitcherItems: Array<FeatureSwitcherItem>;
}

/**
 * Hook for managing observability features and feature switching functionality.
 *
 * This hook handles the logic for determining which observability feature is currently active,
 * managing feature availability, and providing data for feature switcher UI components.
 * It automatically syncs the current feature with the URL path and provides fallback
 * to default features when needed.
 *
 * @param enabledFeatures - Array of observability features that are enabled in the module configuration
 * @param defaultActiveFeature - Optional default feature to use when no feature is explicitly specified
 * @param productId - Product ID retrieved from URL parameters
 * @returns Object containing the current feature state, available features, and UI helper components
 */
export const useObservabilityFeatures = (
  enabledFeatures: ObsFeatureType[],
  defaultActiveFeature?: ObsFeatureType,
  productId?: string,
): UseObservabilityFeaturesResult => {
  const location = useLocation();

  const availableFeatures: ObsFeatureType[] = useMemo(() => {
    return Object.values(ObsFeatureType).filter((feature) =>
      enabledFeatures.includes(feature),
    );
  }, [enabledFeatures]);

  const safeDefaultFeature = useMemo(
    () => getSafeDefaultFeature(availableFeatures, defaultActiveFeature),
    [defaultActiveFeature, availableFeatures],
  );

  const [currentObsFeatureResult, setCurrentObsFeatureResult] = useState<
    ObsFeatureResult
  >(
    availableFeatures.length > 0 && safeDefaultFeature
      ? createSuccess(safeDefaultFeature)
      : createError('undefined'),
  );

  const currentObsFeature = isSuccess(currentObsFeatureResult)
    ? currentObsFeatureResult.data
    : null;
  const hasValidFeature = isSuccess(currentObsFeatureResult);

  const shouldShowFeatureSwitcher = availableFeatures.length > 1;

  const featureSwitcherItems = useMemo(
    () =>
      availableFeatures.map((obsFeature) => ({
        id: obsFeature,
        link: `/dashboards/${productId}/${obsFeature}`,
      })),
    [availableFeatures, productId],
  );

  useLayoutEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const pathFeature = segments
      .find((segment) =>
        availableFeatures.includes(segment.toLowerCase() as ObsFeatureType),
      )
      ?.toLowerCase() as ObsFeatureType;

    if (availableFeatures.length === 0) {
      setCurrentObsFeatureResult(createError('undefined'));
    } else if (pathFeature) {
      setCurrentObsFeatureResult(createSuccess(pathFeature));
    } else if (safeDefaultFeature) {
      setCurrentObsFeatureResult(createSuccess(safeDefaultFeature));
    } else {
      setCurrentObsFeatureResult(createError('undefined'));
    }
  }, [location.pathname, availableFeatures, safeDefaultFeature]);

  return {
    currentObsFeature,
    currentObsFeatureResult,
    availableFeatures,
    hasValidFeature,
    shouldShowFeatureSwitcher,
    featureSwitcherItems,
  };
};
