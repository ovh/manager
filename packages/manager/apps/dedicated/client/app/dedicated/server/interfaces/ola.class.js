import _ from 'lodash';
import { VIRTUAL_TYPE } from './interfaces.constants';
import { OLA_MODES } from './ola-configuration/ola-configuration.constants';

export default class Ola {
  constructor(resource) {
    Object.assign(this, resource);

    this.configStep = !_.isUndefined(this.configStep)
      ? parseInt(this.configStep, 10)
      : 0;
  }

  getCurrentMode() {
    return this.isConfigured()
      ? OLA_MODES.VRACK_AGGREGATION
      : OLA_MODES.DEFAULT;
  }

  isActivated() {
    return !_.isEmpty(this.supportedModes);
  }

  isAvailable() {
    return this.available;
  }

  isConfigured() {
    return this.interfaces.some(i => i.type === VIRTUAL_TYPE.vrackAggregation);
  }
}
