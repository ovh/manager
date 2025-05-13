import find from 'lodash/find';
import Base from './base.class';

export default class ServiceIntegration extends Base {
  constructor({ id, sourceServiceId, destinationServiceId, status, type }) {
    super();
    this.updateData({
      id,
      sourceServiceId,
      destinationServiceId,
      status,
      type,
    });
  }

  setServicesNames(serviceList) {
    this.sourceServiceName = find(serviceList, {
      id: this.sourceServiceId,
    })?.description;
    this.destinationServiceName = find(serviceList, {
      id: this.destinationServiceId,
    })?.description;
  }

  updateData({ id, sourceServiceId, destinationServiceId, status, type }) {
    Object.assign(this, {
      id,
      sourceServiceId,
      destinationServiceId,
      status,
      type,
    });
  }
}
