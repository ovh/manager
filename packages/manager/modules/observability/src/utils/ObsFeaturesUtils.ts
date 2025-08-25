import { ObsFeatureType } from '../types';

export function getSafeDefaultFeature(
  enabledFeatures: ObsFeatureType[],
  defaultFeature?: ObsFeatureType,
): ObsFeatureType | null {
  if (defaultFeature && enabledFeatures.includes(defaultFeature)) {
    return defaultFeature;
  }
  return enabledFeatures[0] ?? null;
}
