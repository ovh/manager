import _ from 'lodash';

export default class {
  static groupByManualRenewCapabilities(services, nichandle) {
    return _.groupBy(services, service => service.getManualRenewCapability(nichandle).reason);
  }
}
