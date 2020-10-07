import includes from 'lodash/includes';

export default class Job {
  constructor({ id, status, spec, createdAt, updatedAt, user }) {
    Object.assign(this, {
      id,
      status,
      spec,
      createdAt,
      updatedAt,
      user,
    });
  }

  canBeKilled() {
    return includes(
      ['RUNNING', 'INITIALIZING', 'QUEUED', 'PENDING'],
      this.status.state,
    );
  }

  getClassForState() {
    switch (this.status.state) {
      case 'FAILED':
      case 'ERROR':
        return 'oui-status_error';
      case 'INTERRUPTING':
      case 'INTERRUPTED':
        return 'oui-status_warning';
      case 'PENDING':
      case 'QUEUED':
      case 'INITIALIZING':
      case 'SYNCING':
      case 'FINALIZING':
        return 'oui-status_info';
      case 'DONE':
      case 'RUNNING':
        return 'oui-status_success';
      default:
        return 'oui-status_info';
    }
  }

  isSuccess() {
    return this.status.state === 'DONE';
  }

  isRunning() {
    return this.status.state === 'RUNNING';
  }

  isFailed() {
    return this.status.state === 'FAILED';
  }

  isTerminal() {
    return ['FAILED', 'INTERRUPTED', 'DONE', 'ERROR'].includes(
      this.status.state,
    );
  }
}
