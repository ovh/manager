import groupBy from 'lodash/groupBy';

export default class {
  static groupByManualRenewCapabilities(services, nichandle) {
    return groupBy(
      services,
      (service) => service.getManualRenewCapability(nichandle).reason,
    );
  }
}
