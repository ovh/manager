import { STATUS } from './cloud-connect.constants';

export default class CloudConnectTasks {
  constructor(task) {
    Object.assign(this, task);
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
