export default class FeatureAvailabilityResult {
  constructor(apiResult = {}) {
    this.features = apiResult;
  }

  isFeatureAvailable(featureName) {
    return this.features[featureName];
  }
}
