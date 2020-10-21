import groupBy from 'lodash/groupBy';

export default class {
  static groupByAutorenewCapabilities(services, nichandle) {
    return groupBy(
      services,
      (service) => service.getAutorenewCapability(nichandle).reason,
    );
  }
}
