export default class Job {
  constructor({ id, username, password, url, user, createdAt, region }) {
    Object.assign(this, {
      id,
      username,
      password,
      url,
      user,
      createdAt,
      region,
    });
  }
}
