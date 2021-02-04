import { STATUS } from './web-paas.constants';

export default class Project {
  constructor({
    offer,
    partnerProjectId,
    projectName,
    serviceId,
    startDate,
    status,
    provider,
  }) {
    Object.assign(this, {
      offer,
      partnerProjectId,
      projectName,
      serviceId,
      startDate,
      status,
      provider,
    });
    if (this.partnerProjectId) {
      this.displayName = `${this.projectName} - ${this.partnerProjectId}`;
    } else {
      this.displayName = this.projectName;
    }
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isError() {
    return this.status === STATUS.ERROR;
  }

  isProcessing() {
    return [STATUS.PENDING, STATUS.CANCELLING].includes(this.status);
  }
}
