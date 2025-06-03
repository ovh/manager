import isEmpty from 'lodash/isEmpty';

export default class Ola {
  constructor(resource) {
    Object.assign(this, resource);
  }

  getCurrentMode() {
    if (this.isAvailable() && this.interfaces.length) {
      const formattedInterfaces = this.interfaces.reduce(
        (interfaces, iface) => {
          const updatedIfaces = interfaces;
          updatedIfaces[iface.type] = iface.mac.split(', ');
          return updatedIfaces;
        },
        {},
      );

      if (
        (formattedInterfaces[this.constants.OLA_MODES.VRACK_AGGREGATION]
          ?.length === 4 ||
          formattedInterfaces[this.constants.OLA_MODES.VRACK_AGGREGATION]
            ?.length === 2) &&
        !formattedInterfaces[this.constants.OLA_MODES.PUBLIC_AGGREGATION]
      ) {
        return this.constants.OLA_MODES.FULL_LAG;
      }

      if (
        formattedInterfaces[this.constants.OLA_MODES.VRACK_AGGREGATION]
          ?.length === 2 &&
        formattedInterfaces[this.constants.OLA_MODES.PUBLIC_AGGREGATION]
          ?.length === 2
      ) {
        return this.constants.OLA_MODES.DOUBLE_LAG;
      }

      return this.constants.OLA_MODES.AVAILABLE;
    }

    return this.constants.OLA_MODES.UNAVAILABLE;
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
