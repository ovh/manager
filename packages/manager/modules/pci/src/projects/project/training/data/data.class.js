export default class Data {
  constructor({ id, name, region, user, created }) {
    Object.assign(this, {
      id,
      name,
      region,
      user,
      created,
    });
  }
}
