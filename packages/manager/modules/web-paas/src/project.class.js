import get from 'lodash/get';
import { STATUS } from './web-paas.constants';

export default class Project {
  constructor({
    offer,
    metadata,
    partnerProjectId,
    projectName,
    serviceId,
    startDate,
    status,
  }) {
    Object.assign(this, {
      offer,
      metadata,
      partnerProjectId,
      projectName,
      serviceId,
      startDate,
      status,
    });
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isError() {
    return [STATUS.SUSPENDED, STATUS.ERROR].includes(this.status);
  }

  isProcessing() {
    return [STATUS.PENDING, STATUS.CANCELLING].includes(this.status);
  }

  availableUserLicenses() {
    return get(this, 'metadata.project.availableUserLicenses');
  }

  availableEnvironments() {
    return get(this, 'metadata.project.availableEnvironments');
  }
}
