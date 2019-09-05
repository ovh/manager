import _ from 'lodash';

export default class {
  static groupByAutorenewCapabilities(services, nichandle) {
    return _.groupBy(services, service => service.getAutorenewCapability(nichandle).reason);
  }
}
