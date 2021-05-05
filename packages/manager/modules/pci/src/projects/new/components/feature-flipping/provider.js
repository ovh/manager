import OvhFeatureFlipping from './feature-flipping.class';

export default class OvhFeatureFlippingProvider extends OvhFeatureFlipping {
  /* @ngInject */
  constructor(coreConfigProvider) {
    super(coreConfigProvider.getRegion());
  }

  $get() {
    return {
      addFeature: (feature) => this.addFeature(feature),
      addFeatures: (featureList) => this.addFeatures(featureList),
      isFeatureActive: (featureKey) => this.isFeatureActive(featureKey),
    };
  }
}
