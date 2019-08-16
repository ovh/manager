export default class Project {
  /* @ngInject */
  constructor(project) {
    Object.assign(this, project);
  }

  isCreating() {
    return this.status === 'creating';
  }

  isDeleting() {
    return this.status === 'deleting';
  }

  isSuspended() {
    return this.status === 'suspended';
  }

  isDeleted() {
    return this.status === 'deleted';
  }

  isActive() {
    return this.status === 'ok';
  }
}
