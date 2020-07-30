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
    });
  }

  canBeKilled() {
    return (
      this.state === 'RUNNING' ||
      this.state === 'QUEUING' ||
      this.state === 'QUEUED'
    );
  }
}
