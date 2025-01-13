import { STATUS, DIAGNOSTIC_DESC } from './cloud-connect.constants';

export default class CloudConnectDiagnostics {
  constructor(diagnostic) {
    Object.assign(this, diagnostic);
    this.name = this.description;
  }

  getDescription() {
    return DIAGNOSTIC_DESC[this.function];
  }

  isDone() {
    return this.status === STATUS.DONE;
  }

  isInProcess() {
    return this.status === STATUS.TODO || this.status === STATUS.DOING;
  }

  isError() {
    return this.status === STATUS.ERROR;
  }
}
