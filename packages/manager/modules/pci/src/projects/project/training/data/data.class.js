export default class Data {
  constructor({ id, name, region, user, created, container, containerRegion }) {
    Object.assign(this, {
      id,
      name,
      region,
      user,
      created,
      container,
      containerRegion,
    });
  }
}
