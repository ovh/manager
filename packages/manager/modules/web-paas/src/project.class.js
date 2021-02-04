import { STATUS } from './web-paas.constants';

export default class Project {
  constructor(project) {
    Object.assign(this, project);
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
    return this.status === STATUS.PENDING || this.status === STATUS.CANCELLING;
  }
}
