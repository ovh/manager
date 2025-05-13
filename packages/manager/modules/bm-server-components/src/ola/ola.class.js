import isEmpty from 'lodash/isEmpty';

export default class Ola {
  constructor(resource) {
    Object.assign(this, resource);
  }

  getCurrentMode() {
    return this.isConfigured()
      ? this.constants.OLA_MODES.VRACK_AGGREGATION
      : this.constants.OLA_MODES.DEFAULT;
  }

  isActivated() {
    return !isEmpty(this.supportedModes);
  }

  isAvailable() {
    return this.available;
  }

  isConfigured() {
    return (
      this.interfaces.length === 1 && this.interfaces[0].isVrackAggregation()
    );
  }
}
