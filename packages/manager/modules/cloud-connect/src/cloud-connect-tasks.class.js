export default class CloudConnectTasks {
  constructor(task) {
    Object.assign(this, task);
  }

  isDone() {
    return this.status === 'done';
  }

  isInProcess() {
    return this.status === 'todo' || this.status === 'doing';
  }

  isError() {
    return this.status === 'error';
  }
}
