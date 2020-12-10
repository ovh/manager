import includes from 'lodash/includes';

export const STATE_ENUM = {
  RUNNING: 'RUNNING',
  TIMEOUT: 'TIMEOUT',
  INITIALIZING: 'INITIALIZING',
  FINALIZING: 'FINALIZING',
  PENDING: 'PENDING',
  QUEUED: 'QUEUED',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
  INTERRUPTING: 'INTERRUPTING',
  INTERRUPTED: 'INTERRUPTED',
  DONE: 'DONE',
};

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
      [
        STATE_ENUM.RUNNING,
        STATE_ENUM.INITIALIZING,
        STATE_ENUM.QUEUED,
        STATE_ENUM.PENDING,
      ],
      this.status.state,
    );
  }

  getClassForState() {
    switch (this.status.state) {
      case STATE_ENUM.FAILED:
      case STATE_ENUM.ERROR:
        return 'oui-status_error';
      case STATE_ENUM.TIMEOUT:
      case STATE_ENUM.INTERRUPTING:
      case STATE_ENUM.INTERRUPTED:
        return 'oui-status_warning';
      case STATE_ENUM.PENDING:
      case STATE_ENUM.QUEUED:
      case STATE_ENUM.INITIALIZING:
      case STATE_ENUM.FINALIZING:
        return 'oui-status_info';
      case STATE_ENUM.DONE:
      case STATE_ENUM.RUNNING:
        return 'oui-status_success';
      default:
        return 'oui-status_info';
    }
  }

  isPreRunning() {
    return (
      this.status.state === STATE_ENUM.QUEUED ||
      this.status.state === STATE_ENUM.PENDING ||
      this.status.state === STATE_ENUM.INITIALIZING
    );
  }

  isPostRunning() {
    return (
      this.status.state === STATE_ENUM.FINALIZING ||
      this.status.state === STATE_ENUM.INTERRUPTING
    );
  }

  isSuccess() {
    return this.status.state === STATE_ENUM.DONE;
  }

  isRunning() {
    return this.status.state === STATE_ENUM.RUNNING;
  }

  isFailed() {
    return (
      this.status.state === STATE_ENUM.FAILED ||
      this.status.state === STATE_ENUM.ERROR
    );
  }

  isTerminal() {
    return [
      STATE_ENUM.FAILED,
      STATE_ENUM.INTERRUPTED,
      STATE_ENUM.DONE,
      STATE_ENUM.ERROR,
    ].includes(this.status.state);
  }
}
