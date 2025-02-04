import { STATUS } from './cloud-connect.constants';

export default class CloudConnectDiagnostics {
  constructor(diagnostic) {
    Object.assign(this, diagnostic);
    this.name = this.description;
  }

  canDownload() {
    return !!this.result?.length;
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
