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
}
