export default class Data {
  constructor({
    id,
    name,
    region,
    user,
    created,
    container,
    containerRegion,
    pushStatus,
    pullStatus,
    pushDate,
    pullDate,
  }) {
    Object.assign(this, {
      id,
      name,
      region,
      user,
      created,
      container,
      containerRegion,
      pushStatus,
      pullStatus,
      pushDate,
      pullDate,
    });
  }
}
