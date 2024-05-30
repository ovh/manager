export default class XdslAccessListService {
  /* @ngInject */
  constructor(iceberg) {
    this.iceberg = iceberg;
  }

  getServices() {
    return this.iceberg('/xdsl')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data: result }) => result);
  }

  getFiberEligibilityList(serviceName) {
    return this.iceberg(`/xdsl/${serviceName}/fiberEligibilities`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data: result }) => result);
  }
}
