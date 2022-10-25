import NutanixLicence from './licence.class';

export default class NutanixLicences {
  constructor(features) {
    this.features = features
      .filter((feature) => feature.name !== 'volumes')
      .map((feature) => new NutanixLicence(feature.name, feature.value));
  }

  getFeatures() {
    return this.features;
  }

  getFeatureByName(featureName) {
    return this.features.find((feature) => feature.getName() === featureName);
  }

  isFeatureAvailable(featureName) {
    return this.getFeatureByName(featureName) != null;
  }
}
