import find from 'lodash/find';
import Base from './base.class';

export default class ServiceIntegration extends Base {
  constructor({ id, serviceId, status, type }) {
    super();
    this.updateData({
      id,
      serviceId,
      status,
      type,
    });
  }

  setServiceName(serviceList) {
    this.serviceName = find(serviceList, { id: this.serviceId })?.description;
  }

  updateData({ id, serviceId, status, type }) {
    Object.assign(this, { id, serviceId, status, type });
  }
}
