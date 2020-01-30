import includes from 'lodash/includes';

export default class FeatureAvailability {
  constructor({ ovhSubsidiary }, CAPABILITIES) {
    this.ovhSubsidiary = ovhSubsidiary;
    this.CAPABILITIES = CAPABILITIES;
  }

  isAvailable(feature) {
    return includes(this.CAPABILITIES[feature], this.ovhSubsidiary);
  }
}
