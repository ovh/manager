import { ObsFeatureType } from '../types';

export function getSafeDefaultFeature(
  enabledFeatures: ObsFeatureType[],
  defaultFeature?: ObsFeatureType,
): ObsFeatureType | null {
  if (enabledFeatures.length === 0) {
    return null;
  }

  if (defaultFeature && enabledFeatures.includes(defaultFeature)) {
    return defaultFeature;
  }

  return enabledFeatures[0];
}
