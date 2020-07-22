export default class Job {
  constructor({
    command,
    data,
    image,
    resources,
    user,
    created,
    id,
    state,
    updatedOn,
    region,
    accessUrl,
    resourceUsageUrl,
    totalRuntime,
  }) {
    Object.assign(this, {
      command,
      data,
      image,
      resources,
      user,
      created,
      id,
      state,
      updatedOn,
      region,
      accessUrl,
      resourceUsageUrl,
      totalRuntime,
    });
  }

  jobCanBeKilled() {
    return (
      this.state === 'RUNNING' ||
      this.state === 'QUEUING' ||
      this.state === 'QUEUED'
    );
  }

  getClassForState() {
    switch (this.state) {
      case 'CANCELLED':
      case 'FAILED':
        return 'oui-status_error';
      case 'CANCELLING':
      case 'INTERRUPTED':
        return 'oui-status_warning';
      case 'SUCCEEDED':
        return 'oui-status_success';
      case 'QUEUING':
      case 'QUEUED':
      case 'RUNNING':
        return 'oui-status_info';
      default:
        return 'oui-status_info';
    }
  }

  isSuccess() {
    return this.state === 'SUCCEEDED' || this.state === 'CANCELLED';
  }

  isRunning() {
    return this.state === 'RUNNING';
  }

  isFailed() {
    return this.state === 'FAILED';
  }
}
