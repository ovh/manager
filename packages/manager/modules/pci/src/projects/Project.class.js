import { CLOUD_PROJECT_STATE, CLOUD_PROJECT_BILLING_STATE } from '../constants';

export default class Project {
  /* @ngInject */
  constructor(project) {
    Object.assign(this, project);
  }

  isCreating() {
    return this.status === CLOUD_PROJECT_STATE.creating;
  }

  isDeleting() {
    return this.status === CLOUD_PROJECT_STATE.deleting;
  }

  isSuspended() {
    return this.status === CLOUD_PROJECT_STATE.suspended;
  }

  isTerminated() {
    return (
      this?.service?.billing.lifecycle.current.state ===
      CLOUD_PROJECT_BILLING_STATE.TERMINATED
    );
  }

  hasPendingDebt() {
    return (
      this?.service?.billing.lifecycle.current.state ===
      CLOUD_PROJECT_BILLING_STATE.UNPAID
    );
  }

  isDeleted() {
    return this.status === CLOUD_PROJECT_STATE.deleted;
  }

  isActive() {
    return this.status === CLOUD_PROJECT_STATE.ok;
  }

  get projectId() {
    return this.project_id;
  }
}
