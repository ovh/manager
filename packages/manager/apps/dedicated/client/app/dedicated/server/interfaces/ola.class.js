import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';

import { VIRTUAL_TYPE } from './interfaces.constants';
import { OLA_MODES } from './ola-configuration/ola-configuration.constants';

export default class Ola {
  constructor(resource) {
    Object.assign(this, resource);

    this.configStep = !isUndefined(this.configStep)
      ? parseInt(this.configStep, 10)
      : 0;
  }

  getCurrentMode() {
    return this.isConfigured()
      ? OLA_MODES.VRACK_AGGREGATION
      : OLA_MODES.DEFAULT;
  }

  isActivated() {
    return !isEmpty(this.supportedModes);
  }

  isAvailable() {
    return this.available;
  }

  isConfigured() {
    return this.interfaces.some(
      (i) => i.type === VIRTUAL_TYPE.vrackAggregation,
    );
  }
}
