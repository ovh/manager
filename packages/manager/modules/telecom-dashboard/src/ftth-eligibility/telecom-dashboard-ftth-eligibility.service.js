export default class {
  /* @ngInject */
  constructor(iceberg) {
    this.iceberg = iceberg;
  }

  getAllServices() {
    return this.iceberg('/xdsl')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data: result }) => result);
  }

  getFiberEligibilities(serviceName) {
    return this.iceberg(`/xdsl/${serviceName}/fiberEligibilities`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data: result }) => result);
  }
}
