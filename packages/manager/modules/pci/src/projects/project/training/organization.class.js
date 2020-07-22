export default class Organization {
  constructor({ id, name, region }) {
    Object.assign(this, {
      id,
      name,
      region,
    });
  }
}
