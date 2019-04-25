import _ from 'lodash';

export default class PublicCloud {
  /* @ngInject */
  constructor(iceberg) {
    this.iceberg = iceberg;
  }

  getProjects(filters = []) {
    let promise = this
      .iceberg('/cloud/project')
      .query()
      .expand('CachedObjectList-Cursor');

    filters.forEach(({ field, comparator, reference }) => {
      promise = promise.addFilter(field, comparator, reference);
    });

    return promise
      .sort('description') // Doesn't work as long as cache is not enabled
      .execute()
      .$promise
      .then(projects => _.sortBy(projects, 'description')); // Fallback
  }
}
