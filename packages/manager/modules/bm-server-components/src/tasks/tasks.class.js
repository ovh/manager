import { TASK_STATUS } from './constants';

export default class BmServerComponentsTask {
  constructor(lastUpdate, comment, action, status) {
    Object.assign(this, {
      lastUpdate,
      comment,
      action,
      status,
    });
  }

  isReady() {
    return this.status === TASK_STATUS.DONE;
  }

  isUpdating() {
    return (
      this.status === TASK_STATUS.DOING ||
      this.status === TASK_STATUS.INIT ||
      this.status === TASK_STATUS.TODO
    );
  }

  isError() {
    return (
      this.status === TASK_STATUS.OVH_ERROR ||
      this.status === TASK_STATUS.CUSTOMER_ERROR
    );
  }
}
