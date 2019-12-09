
export default class Namespace {
  constructor({
    clusterId,
    container,
    containerId,
    createdAt,
    description,
    region,
    id,
    url,
    hubUrl,
  }) {
    Object.assign(this, {
      clusterId,
      container,
      containerId,
      createdAt,
      description,
      region,
      id,
      url,
      hubUrl,
    });
  }
}
