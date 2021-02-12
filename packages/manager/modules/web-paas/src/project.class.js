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
    provider,
  }) {
    Object.assign(this, {
      offer,
      metadata,
      partnerProjectId,
      projectName,
      serviceId,
      startDate,
      status,
      provider,
    });
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
