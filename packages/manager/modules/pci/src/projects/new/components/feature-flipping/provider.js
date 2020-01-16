import { Environment } from '@ovh-ux/manager-config';
import OvhFeatureFlipping from './feature-flipping.class';

export default class OvhFeatureFlippingProvider extends OvhFeatureFlipping {
  constructor() {
    super(Environment.getRegion());
  }

  $get() {
    return {
      addFeature: (feature) => this.addFeature(feature),
      addFeatures: (featureList) => this.addFeatures(featureList),
      isFeatureActive: (featureKey) => this.isFeatureActive(featureKey),
    };
  }
}
